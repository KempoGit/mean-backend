// Is a Object Data Modeling (ODM) library for MongoDB.
const mongoose = require('mongoose');

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.DB_CNN);
        console.log('DB connection established');

    } catch (e) {

        console.log(e);
        throw new Error('Error connecting to MongoDB');

    }

}

module.exports = {
    dbConnection
}