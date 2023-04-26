const ExpressError = require('./utilities/ExpressError')
const {reviewSchema, goalSchema, booksBorrowedSchema} = require('./schemas')

module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ USER..." , req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in!")
        res.redirect('/login')
    }else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(d => d.message).join(', ')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.validateGoal = (req, res, next) => {
    console.log("==================")
    console.log(req.body.goal)
    const {error} = goalSchema.validate(req.body.goal)
    if(error){
        console.log(error)
        const msg = error.details.map(d => d.message).join(', ')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
