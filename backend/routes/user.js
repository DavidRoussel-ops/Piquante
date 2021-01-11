//Constante qui appel express.
const express = require('express');
//Constante qui appel le router.
const router = express.Router();
//Constante qui appel le controller de l'authentification.
const userCtrl = require('../controllers/auth');

//Route de la création ou de la connexion utilisateur.
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
