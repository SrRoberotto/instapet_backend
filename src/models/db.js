const mongoose = require('mongoose');
const dbConfig = require("../config/db.config.js");

//dbConectionString = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.URL}/?retryWrites=true&w=majority`;
dbConectionString = dbConfig.URL_FULL;
console.log('Tentando conectar a: ' + dbConectionString);
//conexão com o DB
mongoose.connect(dbConectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: dbConfig.DATABASE,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB at: ' + dbConfig.URL);
});

module.exports = mongoose.connection