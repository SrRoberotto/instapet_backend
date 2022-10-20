const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

//desacoplar o protocolo HTTP do socket
const server = require('http').Server(app);
const io = require('socket.io')(server);

//conexão com o DB
mongoose.connect('mongodb+srv://instapet_admin:Admin2022@clusterprincipal.pfl5lcv.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
});

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