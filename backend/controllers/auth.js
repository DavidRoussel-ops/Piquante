//Constante qui appel bcrypt.
const bcrypt = require('bcrypt');
//Constante qui appel jsonwebtoken.
const jwt = require('jsonwebtoken');

//Constante qui appel le model d'utilisateur.
const User = require('../models/User');
const tokenSecurity = require('../Security/key');

//Enregistrement d'un utilisateur.
exports.signup = (req, res, next) => {
    let mdp = req.body.password;
    if (/[a-z]/ && /[A-Z]/ && /[1-9]/ && /[&$£%!§]/.test(mdp) === true) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                })
                user.save()
                    .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                    .catch(error => res.status(400).json({error}));
            })
            .catch(error => res.status(500).json({error}));
    } else {
        if (/[a-z]/ && /[A-Z]/ && /[1-9]/ && /[&$£%!§]/.test(mdp) === false) {
            console.log("Veuillez renseigner un mots de passe contenant aux moins une majuscule, une minuscule, un chiffre et un symbole '&$£%!§'.")
        }
    }
}

//Connexion d'un utilisateur existant.
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            tokenSecurity,
                            {expiresIn: '24h'},)
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
