const express = require('express')
const app = express()
const port = 3003
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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxpfd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointment_collection = client.db("db_doctors").collection("coll_appointment");
    console.log("db connected")

    app.post('/addAppointment' , (req,res) => {
        const appointment = req.body;
        appointment.date = appointment.date.slice(0,15)
        console.log(appointment.date.slice(0,15))
        appointment_collection.insertOne(appointment)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/appointmentsByDate' , (req,res) => {
        const date = req.body;
        console.log(date.date.slice(0,15))
        appointment_collection.find({date: date.date.slice(0,15)})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.post('/addADoctor' , (req,res)=>{
        const file = req.files.file;
        const name = req.files.name;
        const email = req.files.email;
        console.log(file, name, email);

    })

    app.get('/test', (req, res) => {
        res.send('doctors portal db test!')
    })

});


app.get('/', (req, res) => {
    res.send('doctors portal backend!')
})

app.listen(process.env.PORT || port) // 3003