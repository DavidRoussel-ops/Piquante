//Constante qui appel express.
const express = require('express');
//Constante qui appel le router.
const router = express.Router();
//Constante qui appel body parser.
const bodyParser = require('body-parser');

//Constante qui appel le middleware d'authentification.
const auth = require('../Security/token');
//Constante qui appel le middleware multer config.
const multer = require('../middleware/multer-config');

//Constante qui appel les fonction des sauces.
const stuffCtrl = require('../controllers/stuff');

//Utilisation de body parser.
router.use(bodyParser.json());

//Route à utiliser selon l'utilité de l'utilisateur.
router.post('/', auth, multer, stuffCtrl.createSauces);
router.post('/:id/like', auth, stuffCtrl.saucesIdLike);
router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauces);
router.put('/:id', auth, multer, stuffCtrl.updateSauces);
router.delete('/:id', auth, stuffCtrl.deleteSauces);


module.exports = router;
