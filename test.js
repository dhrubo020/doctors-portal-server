const express = require('express')
const app = express()
const port = 3333
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
const fileUpload = require('express-fileupload');
app.use(express.static('doctors'));
app.use(fileUpload());
// const ObjectId = require('mongodb').ObjectId;



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user_test:password_test@cluster0.fxpfd.mongodb.net/db_test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("db_test").collection("coll_test");
  // perform actions on the collection object
  client.close();
});


// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://user_test:password_test@cluster0.fxpfd.mongodb.net/db_test?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const appointment_collection = client.db("db_test").collection("coll_test");
//     console.log("db connected")

//     app.get('/test', (req, res) => {
//         res.send('doctors portal db test!')
//     })

// });


app.get('/', (req, res) => {
    res.send('doctors portal backend!')
})

app.listen(process.env.PORT || port) // 3003