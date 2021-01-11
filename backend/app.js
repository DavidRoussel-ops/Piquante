//Constante qui appel express.
const express = require('express');
//Constante qui appel body parser
const bodyParser = require('body-parser');
//Constante qui appel path.
const path = require('path');

//Constante qui appel la route des fonctions sauce.
const stuffRoutes = require('./routes/stuff');
//Constante qui appel la route des utilisateurs.
const userRoutes = require('./routes/user');
const mongoRoutes = require('./Security/mongo');


const app = express();

//Header utiliser par l'application.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
