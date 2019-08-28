const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Data = require('./data');

const API_PORT = process.env.PORT || 3000;
const app = express();
const router = express.Router();

app.use(cors());

// Initializing MongoDB database
const dbRoute = 'mongodb+srv://withoutwax:weUdFlN0i8hzyQPf@personal-kucbv.gcp.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;
db.once('opne', () => console.log("Connected to the database"));
// Checks if the database connection is successful / unsuccessful
db.on('error', console.error.bind(console, "MongoDB connection error:"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err }); 
        return res.json({ success: true, data: data })
    });
});

// UPDATE
router.post('/updateData', (req, res) => {
    const { type, update } = req.body;
    Data.findByIdAndUpdate(type, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// DELETE
router.delete('/deleteData', (req, res) => {
    const { type } = req.body;
    Data.findByIdAndRemove(type, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// CREATE
router.post('/putData', (req, res) => {
    let data = new Data();

    const { type, date } = req.body;

    if ((!type && type !== 0) || !date) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        }); 
    }
    data.date = date;
    data.type = type;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// append /api for out http requests
app.use('/api', router);

app.listen(API_PORT, () => {
    console.log(`THE SERVER IS LISTENING ON PORT ${API_PORT}`);
});