const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    // Connecting to the database
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Successfully connected to the database....");
    }).catch((error) => {
        console.log('Could not connect to the database....', error);
        process.exit(1);
    })
};