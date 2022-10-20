const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    //Método invocado quando recebe uma requisição GET
    async index (req, res){
        const posts = await Post.find().sort('-createdAt'); //retorna os posts
                                                            //em ordem decrescente
        return res.json(posts);            

    },

    //Método invocado quando recebe uma requisição POST
    async store (req, res){
        //console.log (req.body); //mostrar a requisição POST no console
        //console.log (req.file); //mostrar a requisição POST no console
        
        //pega os campos do body
        const {author, place, description, hashtags} = req.body;

        //pega o campo filename que foi processado e renomeia para image 
        const {filename: image} = req.file;

        //separa o nome e extensão da imagem
        const [name, ext] = image.split('.');
        const fileName = `${name}_small.jpg`;

        //Redimensionar imagem, salvando no na pasta RESIZED
        await sharp(req.file.path)
            .resize(500)
            .jpeg({
                quality: 70
            })
            .toFile(
                path.resolve(req.file.destination,'..','resized', fileName)
            )
            
        //Apaga a imagem com tamanho original
        //fs.unlinkSync(req.file.path);

        const postObj = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,

        })
 
        //atualiza por socket
        req.io.emit('newpostSocket',postObj);

        //para testes: return res.json({ ok:true});
        return res.json(postObj);
    }
   
};