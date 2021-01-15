//Constante qui appel express.
const express = require('express');
//Constante qui appel body parser.
const bodyParser = require('body-parser');
//Constante qui appel path.
const path = require('path');
//Constante qui appel express-mongo-sanitize.
const mongoSanitize = require('express-mongo-sanitize');
//Constante qui appel node-esapi.
const esapi = require('node-esapi');
//Constante qui appel toobusy-js.
const toobusy = require('toobusy-js');
//Constante qui appel express-brute.
const expressBrute = require('express-brute');
//Constante qui appel rate-limiter.
const {RateLimiter} = require("rate-limiter");

//Constante qui appel la route des fonctions sauce.
const stuffRoutes = require('./routes/stuff');
//Constante qui appel la route des utilisateurs.
const userRoutes = require('./routes/user');
//Constante qui appel le dossier de sécurité.
const mongoRoutes = require('./Security/mongo');



const app = express();

//Header utiliser par l'application.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Vérification du nombre d'essai de connexion.
let getLimiter = new RateLimiter();
getLimiter.addLimit('/login', 'GET', 5, 500);

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.use(mongoSanitize());

app.use(mongoSanitize({
    replaceWith: '_'
}))


let store = new expressBrute.MemoryStore();
let bruteForce = new expressBrute(store);

app.post('/auth', bruteForce.prevent,
    function (req,res,next){
    res.send(' Success !')
    })

esapi.encoder().encodeForHTML();
esapi.encoder().encodeForJavaScript();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

app.use(function (req,res,next){
    if (toobusy()){
        res.send(503, 'Je suis occupé en ce moment, désolé.')
    } else {
        next();
    }
})

toobusy.maxLag(10);

toobusy.interval(250);

let currentMaxLag = toobusy.maxLag();
let currentInterval = toobusy.interval();

toobusy.onLag(function (currentLag){
    console.log( " Retard de boucle d'événement détecté! Latence: " + currentLag + " ms ");
});

module.exports = app;
