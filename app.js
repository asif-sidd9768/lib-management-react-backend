if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Book = require('./models/books')
const Quote = require('./models/quotes')
const User = require('./models/user')
const Review = require('./models/review')
const Goal = require('./models/goal')
const BookBorrowed = require('./models/bookBorrowed')
const path = require('path')
const fetch = require('node-fetch');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const MongoStore = require('connect-mongo');

const ExpressError = require('./utilities/ExpressError')
const catchAsync = require('./utilities/catchAsync')
const {isLoggedIn, validateReview, validateGoal} = require('./middleware')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/library-management'
const secret = process.env.SECRET || 'thisshouldbeabettersecret'
// 'mongodb://localhost:27017/library-management'
// Connect to mongoose database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => {
    console.log("Database Connected!")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e) {
    console.log("STORE SESSION ERROR: ", e)
})

const sessionConfig = {
    store,
    name: 'cookaki',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 604800000, // 7 days
        maxAge: 604800000,
    }
}

app.use(session(sessionConfig))

app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
}))

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://code.jquery.com/",
    "https://cdn.jsdelivr.net",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/",
    "https://fonts.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
    "https://code.jquery.com/",
    "https://use.fontawesome.com/",
];

const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://images-na.ssl-images-amazon.com/",
                "https://m.media-amazon.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        }
    })
)


app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

app.use(mongoSanitize())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/',catchAsync(async (req, res) => {
    const books = await Book.find({})
    // console.log(res.locals.currentUser.username)
    res.render("books/index", {books})
}))

app.get('/book/not-available', async (req, res) => {
    const bookBorrowed = await BookBorrowed.find({})
    res.render('books/borrowed', {bookBorrowed})
})

app.get('/book/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'postedBy',
        }
    }).populate('postedBy')
    res.render("books/show", {book})
}))

app.get('/quotes', async (req, res) => {
    const response = await fetch("https://quotable.io/quotes?page=1")
    const data = await response.json();
    const quotesList = data.results
    res.render("quotes/index", {quotesList})
})

app.get('/quotes/add', async (req, res) => {
    const quotes = await Quote.find({})
    res.render("quotes/newQuote", {quotes})
})

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.get('/register', (req, res) => {
    res.render("users/register")
})

app.get('/goals', isLoggedIn, async (req, res) => {
    const crUser = await req.user.populate('goals').execPopulate()
    const goals = crUser.goals
    res.render("goals/index", {goals})
})

app.get('/goals/:id', isLoggedIn, async (req, res) => {
    res.render("goals/detailPopUp")
})

app.get('/profile/:username', isLoggedIn, async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    console.log(user)
    res.render("profile/index", {user})
})

app.get('/api/user', async(req, res) => {
    const user = await User.findById(req.user.id).populate("booksBorrowed").populate("goals")
    console.log(user)
    res.json(user)
})

app.post('/quotes', async (req, res) => {
    console.log("clicked")
    const quote = new Quote(req.body.quote)
    await quote.save()
    res.redirect("/quotes")
})

app.post('/book/:id/notes/', isLoggedIn, validateReview, async(req, res) => {
    const book = await Book.findById(req.params.id)
    console.log("====================")
    const {body}  = req.body.review
    const username = req.user._id
    
    
    console.log(body)
    console.log(username)
    const user = await User.findById(username)
    const review = new Review(req.body.review)
    review.postedBy = username
    book.reviews.push(review)
    await review.save()
    await book.save()
    req.flash('success', 'Review added')
    res.redirect(`/book/${req.params.id}`)
})

app.post('/book/:id/read', isLoggedIn, async(req, res) => {
    console.log("===============================")
    console.log("Clicked")
    const book = await Book.findById(req.params.id)
    const user = await User.findById(req.user.id)
    const bookRead = {
        bookId: book.id,
        bookName: book.name,
        doneReading: true,
    }
    user.booksRead.push(bookRead)
    await user.save()
    console.log(bookRead)
    console.log(user)
    res.redirect(`/book/${req.params.id}`)
})

app.post('/goals/:id/addGoal', isLoggedIn, validateGoal ,async(req, res) => {
    console.log("===============================")
    const crUser = await User.findById(req.params.id)
    const goalToAdd = req.body.goal
    const goal = new Goal(goalToAdd)

    crUser.goals.push(goal)

    await goal.save()
    await crUser.save()
    res.redirect(`/goals`)
})

app.post('/book/:id/borrow', isLoggedIn, async (req, res) => {
    const book = await Book.findById(req.params.id)
    const user = await User.findById(req.user.id)
    const bkBorrowed = new BookBorrowed({
        bookId: book.id,
        bookName: book.name,
        borrowedUserId: user.id,
        borrowedUsername: user.username,
        borrowedDate: Date.now(),
    })
    user.booksBorrowed.push(bkBorrowed)
    book.isAvailable = false
    await bkBorrowed.save()
    await book.save()
    await user.save()
    res.redirect(`/book/${req.params.id}`)
})

app.post('/profile/:id/book-return/:bookId', isLoggedIn, async (req, res) => {
    const user = req.user
    const bookToReturn = await BookBorrowed.findById(req.params.bookId)
    user.booksBorrowed.pull(bookToReturn)

    await BookBorrowed.findByIdAndDelete(req.params.bookId)
    const bookBorrowedList = await BookBorrowed.find({})

    const book = await Book.findById(bookToReturn.bookId)
    book.isAvailable = true

    await user.save()
    await book.save()

    res.redirect(`/profile/${req.user.username}`)
})

app.post('/login', passport.authenticate('local', { failureFlash: 'Invalid username or password', failureRedirect:'/login'}), async (req, res) => {
    req.flash('success', 'You have logged in')
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

app.post('/register', async (req, res) => {
    try{
    const{username, email, password} = req.body
    console.log(username, email)
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
        if(err) return next(err)
        res.redirect('/')
    })
    }catch(err){
        req.flash('error', err.message)
        res.redirect('/register')
    }
})

app.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/')
})

app.all("*", (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = "Oh no, Something Went Wrong!"
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})