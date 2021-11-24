//Constante qui appel mongoose.
const mongoose = require("mongoose");

//Connexion à la base de donnée MongoDB.
mongoose.connect('mongodb+srv://Nofi:Suzy64310@cluster0.div6j.mongodb.net/Cluster0?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée ! '));
