const express = require('express');
const path = require('path');
const multer = require('multer');
const os = require('os');
const uploadConfig = require('./config/upload');
const PubliController = require('./controllers/PubliController');
const LikeController = require('./controllers/LikeController');
const UserController = require('./controllers/UserController');

const routes = new express.Router();
const upload = multer(uploadConfig); 



//************    /publi    ************//
routes.get('/publi',  PubliController.index);

//image = campo na requisição
routes.post('/publi', upload.single('image'), PubliController.store);

//Rota para receber LIKES via POST, recebe o ID do post
routes.post('/publi/:id/like', LikeController.store);

//Rota de listagem de publicações de um usuário
routes.get('/publi/:userID',  PubliController.indexUser);


//************    /user    ************//
// Listar propriedades de um usuario
routes.get('/user/:userID',  UserController.index);

// Listar todos usuarios
routes.get('/user',  UserController.indexAll);

//image = campo na requisição
routes.post('/user', upload.single('image'), UserController.store);

//Rota para atualizar dados do usuário
routes.put('/user/:userID', upload.single('image'), UserController.update);

//Rota para o monitoramento do funcionamento da aplicação
routes.get('/healthcheck', (req, res) => {
    res.json({
        status: 'UP',
        hostname: os.hostname(),
        date: new Date().toISOString(),
        networks: os.networkInterfaces()
     });
});

//Rota padrão mostra o HTML
routes.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'../index.html'));
});

module.exports = routes;