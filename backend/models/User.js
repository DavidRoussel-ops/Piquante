//Constante qui appel mongoose.
const mongoose = require('mongoose');

//Constante qui appel mongoose unique validator.
const uniqueValidator = require('mongoose-unique-validator');

//Constante qui donne le schema d'un utilisateur.
const userSchema = mongoose.Schema({
    userId: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
