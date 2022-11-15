const Publi = require('../models/Publi');
const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    //Método invocado quando recebe uma requisição GET
    async index (req, res){
        //const publis = await Publi.find().sort('-createdAt'); //retorna os posts
                                                            //em ordem decrescente
        //Paginação
        //let query = {};
        let nextPubli = req.query.p || null;
        let limit = parseInt(req.query.q) || 5;

        let query = (nextPubli!==null) ? {_id: { $lt: nextPubli }} : {};

        let publis = await Publi.find(query).sort({
            _id: -1
        }).limit(limit);

        const next = publis[publis.length - 1]._id
        //  res.json({ publis, next })

        return publis.length > 0 ? res.status(200).json({ publis, next }) : res.status(204).json({message: "no publication found"});            

    },

    async indexUser (req, res){
        const userID = req.params.userID;
        //let query = {};
        //let nextPubli = req.query.p || null;
        // let userID = req.query.u || null;
        let limit = parseInt(req.query.q) || 5;

        //let query = (nextPubli!==null) ? {_id: { $lt: nextPubli }} : {};

        let publis = await Publi.find({
            userID: userID
        }).sort({
            _id: -1
        }).limit(limit);

        const next = publis[publis.length - 1]._id
        //  res.json({ publis, next })

        return publis.length > 0 ? res.status(200).json({ publis, next }) : res.status(204).json({message: "no publication found"});            

    },

    //Método invocado quando recebe uma requisição POST
    async store (req, res){
        //console.log (req.body); //mostrar a requisição POST no console
        //console.log (req.file); //mostrar a requisição POST no console
        
        //pega os campos do body
        if (req.body.userID !== undefined){
            userID = req.body.userID;
        } else {
            return res.status(400).json({message:"userID is required"});
        }

        if (req.body.description !== undefined){
            description = req.body.description;
        } else {
            return res.status(400).json({message:"description is required"});
            
        }

        //valida usuário
        const userObj = await User.findOne({userID:userID})
        if (!userObj){
            return res.status(400).json({message:"user not found"})
        }

        
        if (req.file !== undefined){
            //pega o campo filename que foi processado e renomeia para image
            // console.log (req.file);
            // console.log (req.body);
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
                );
                
            // //Apaga a imagem com tamanho original
            fs.unlinkSync(req.file.path);

            const publiObj = await Publi.create({
                userID,
                description,
                publiImage: image,

            });
            return res.status(201).json(publiObj);
        } else {
            return res.status(400).json({message:"image is required"});
        }
        //atualiza por socket
        //req.io.emit('newpostSocket',publiObj);

        //para testes: return res.json({ ok:true});
        
    }
   
};