const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var uniqid = require('uniqid')
const DB_URL = process.env.DB_URL
const DB_NAME = process.env.DB_NAME
const PORT = process.env.PORT || 3000

var db, collection;


//Setup server and connect database
app.listen(PORT, () => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(DB_NAME);
        console.log("Connected to `" + DB_NAME + "`!");
    });
});
//Generate html on fly via EJS || templtate language to get data and generate it to html
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('listItems').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {listItems: result})
  })
})

app.post('/listItems', (req, res) => {
  db.collection('listItems').insertOne({
    id: uniqid(),
    taskContent: req.body.taskContent,
    isComplete: req.body.isComplete},
    (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/listItems', (req, res) => {
  console.log(req.body)
  db.collection('listItems').findOneAndUpdate({taskContent: req.body.taskContent, isComplete: req.body.isComplete}, {
    $set: {
      isComplete: !req.body.isComplete
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/updateTask', (req, res) => {
  console.log(req.body)
  db.collection('listItems').findOneAndUpdate({id: req.body.id}, {
    $set: {
      taskContent: req.body.taskContent,
      isComplete: req.body.isComplete
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/reset', (req, res) => {
  db.collection('listItems').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
app.delete('/clearComplete', (req, res) => {
  db.collection('listItems').deleteMany({isComplete:true}, (err, result) => {
    console.log('clear completed')
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
app.delete('/removeEmpty', (req, res) => {
  db.collection('listItems').findOneAndDelete({id: req.body.id}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
