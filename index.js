const express = require('express')
const app = express()
const port = 3001
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');
app.use(express.static('doctors'));
app.use(fileUpload());
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.fxpfd.mongodb.net:27017,cluster0-shard-00-01.fxpfd.mongodb.net:27017,cluster0-shard-00-02.fxpfd.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-we805n-shard-0&authSource=admin&retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxpfd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if (err) {
        console.log(err)
    }
    const appointment_collection = client.db("db_doctors").collection("coll_appointment");
    const doctor_collection = client.db("db_doctors").collection("coll_doctor");
    console.log("db connected")

    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointment.date = appointment.date.slice(0, 15)
        console.log(appointment.date.slice(0, 15))
        appointment_collection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date.slice(0, 15))
        appointment_collection.find({ date: date.date.slice(0, 15) })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addADoctor', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        console.log(file, name, email);

        const newImg = file.data;
        const encodedImg = newImg.toString('base64');
        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encodedImg, 'base64')
        }

        doctor_collection.insertOne({ name, email, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/doctorList', (req, res) => {
        doctor_collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

});


app.get('/', (req, res) => {
    res.send('doctors portal backend!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`)
})