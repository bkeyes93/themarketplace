const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const item = require('./models/item');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const app = express();
const port = process.env.PORT;
app.listen(port);
app.use(express.json());

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/items', (req, res) => {
    item.find({}, (error, result) => {
        if (result) res.send(result);
        else res.send(error);
    });
});

app.get('/items/:id', (req, res) => {
    item.findOne({_id: req.params.id}, (error, result) => {
        if (result) res.send(result);
        else res.send(error);
    });
});

app.post('/items', (req, res) => {
    const new_item = req.body;
    item.create(new_item, (error, result) => {
        if (result) res.send(result);
        else res.send(error);
    });
});

app.delete('/items/:id', (req, res) => {
    item.deleteOne({_id: req.params.id}, (error, result) => {
        if (result) res.send(result);
        else res.send(error);
    });
});

app.get('*', (req, res) => {
    res.render('404');
});