const express = require('express')
const {connectToDb,getDb} = require('./db')
const { ObjectId } = require('mongodb')

const app = express()
app.use(express.json())

let db

connectToDb((err) => {
    if(!err){
        app.listen('3000',()=>{
            console.log("app is working")
        })
        db = getDb()
    }
})

app.get('/my_books',(req,res) =>{
    const page = req.query.p || 0
    const booksPerPage = 1

        let books = []


        db.collection('my_books')
        .find()
        .sort({author:1})
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(( ) => {
            res.status(200).json(books)
        })

        .catch(() => {
            res.status(500).json({
                error:"could not fetch the doc "
            })
        })

  
})
app.get('/my_books/:id',(req,res) => {

    if(ObjectId.isValid(req.params.id)){
        db.collection('my_books')
      .findOne({_id: new ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err =>{
        res.status(500).json({error: 'could not fetch document'})
      })
    }else{
        res.status(500).json({error:"not a valid document id "})
    }
app.post('./my_books', (req,res) => {
const book = req.body

    db.collection('my_books')
      .insertOne(book)
      .then(result => {
        res.status(201).json(result)
      })
      .catch(err => {
        res.status(500).json({err:"could not create a doc"})
      })
})
    
})

app.delete('/my_books/:id',(req,res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('my_books')
      .deleteOne({_id: new ObjectId(req.params.id)})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err =>{
        res.status(500).json({error: 'could not delete document'})
      })
    }else{
        res.status(500).json({error:"not a valid document id "})
    }
})

app.patch('/my_books', (req,res) => {
    const updates =req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('my_books')
      .updateOne({_id: new ObjectId(req.params.id)},{$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err =>{
        res.status(500).json({error: 'could not update document'})
      })
    }else{
        res.status(500).json({error:"not a valid document id "})
    }
})