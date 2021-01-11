//Constante qui appel le model des sauces.
const Sauce = require('../models/sauce');
//Constante qui appel file system.
const fs = require('fs');

//Création d'une sauce.
exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({Sauce}))
        .catch(error => res.status(400).json({error: error}));
};

//Ajout d'un like/dislike et enregistrement du userId dans le tableau adequate.
exports.saucesIdLike = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const likeSauce = req.body.like;
    Sauce.findOne({_id: sauceId})
        .then((sauce) => {
            if (likeSauce === 0) {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        {_id: sauceId},
                        {$pull: {usersLiked: userId}, $inc: {likes: -1}})
                        .then(() => res.status(200).json({message: "Sauce non liké ! "}))
                        .catch(error => res.status(400).json({error}))
                }
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        {_id: sauceId},
                        {$pull: {usersDisliked: userId}, $inc: {dislikes: 1}})
                        .then(() => res.status(200).json({message: "Sauce non disliké ! "}))
                        .catch(error => res.status(400).json({error}))
                }
            }
            if (likeSauce === 1) {
                Sauce.updateOne(
                    {_id: sauceId},
                    {$addToSet: {usersLiked: userId}, $inc: {likes: likeSauce}}
                )
                    .then(() => res.status(200).json({message: "Sauce liké ! "}))
                    .catch(error => res.status(400).json({error}))
            }
            if (likeSauce === -1) {
                Sauce.updateOne(
                    {_id: sauceId},
                    {$addToSet: {usersDisliked: userId}, $inc: {dislikes: likeSauce}}
                )
                    .then(() => res.status(200).json({message: "Sauce disliké ! "}))
                    .catch(error => res.status(400).json({error}))
            }
        })
        .catch(error => res.status(400).json({error}))
}

//Affichage des sauces enregistrer.
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces)
        })
        .catch((error) => {
            res.status(400).json({error: error})
        });
};

//Affichage d'une sauce grace à son identifiant.
exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(404).json({error: error})
        });
};

//Modification d'une sauce.
exports.updateSauces = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({error}));
};

//Suppression d'une sauce.
exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => res.status(500).json({error}));
};


