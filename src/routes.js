const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');

const routes = new express.Router();
const upload = multer(uploadConfig); 

//Sempre que for invocado o método GET essa rota irá direcionar para o método index
routes.get('/posts',  PostController.index);
  
//Sempre que for invocado o método Post essa rota irá direcionar para o método store
routes.post('/posts', upload.single('image'), PostController.store);

//Rota para receber LIKES via POST, recebe o ID do post
routes.post('/posts/:id/like', LikeController.store);

module.exports = routes;