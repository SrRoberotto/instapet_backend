//Puxa variáveis de ambiente
require("dotenv").config();

const express = require('express');
//const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
//conexão com o DB
const mongoose = require("./models/db.js");

const app = express();

//desacoplar o protocolo HTTP do socket
const server = require('http').Server(app);
const io = require('socket.io')(server);

// const morgan = require('morgan');
// const helmet = require('helmet');
// const compression = require('compression');
// const PORT = process.env.PORT || 3000;
// app.use(morgan(app.get('env') === 'production' ? 'combined' : 'dev'));
// app.use(helmet());
// app.use(compression());

//disponibiliza o socket em toda a aplicação
app.use((req, res, next) => {
    req.io = io;

    next();
})


//habilita o Cors
app.use(cors());
app.origin = "*";

//Define a rota para arquivos de imagens
app.use('/files', express.static(path.resolve(__dirname,'..','uploads','resized')));

//habilita as rotas
app.use(require('./routes'));
 
//app.listen(3333);
server.listen(3333);
console.log("Servidor rodando em http://localhost:3333" );
console.log("Ambiente atual: " + process.env.ENV_ACTUAL);

