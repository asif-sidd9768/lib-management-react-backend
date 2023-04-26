require("dotenv").config()
const mongoose = require('mongoose');
const Book = require('../models/books')
const books = require('./books')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/library-management'

// Connect to mongoose database
mongoose.connect(dbUrl).then(()=>{
  console.log(`successfully connected`);
  }).catch((e)=>{
  console.log(`not connected= `, e);
  }); 

const seedBooks = async() => {
    for (let bk of books){
        const bok = new Book({
            name: bk.name,
            author: bk.author,
            page: bk.page,
            cover: bk.cover,
            description: bk.description,
            isAvailable: true
        })
        // await bk.update({
        //     isAvailable: true
        // })
        // console.log(bk.name + ' updated')
        await bok.save()
        console.log("Updated")
    }
}

seedBooks()