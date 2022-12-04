const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
    //Método invocado quando recebe uma requisição GET com o userID
    async index (req, res){
        const userID = req.params.userID;

        try {
            const userObj = await User.findOne({userID:userID});
            
            if (!userObj){
                return res.status(400).json({message:"user not found"});
            } else {
                return res.status(200).json(userObj);
            }

            
        } catch(error) {
            console.log(error.message); 
            return res.status(400).json({message:error.message});
        }
    },
    //Método invocado quando recebe uma requisição GET sem o userID
    async indexAll (req, res){
        try {
            const userObj = await User.find({},{userID: 1,name:1,email:1,isActve:1}).sort({userID:-1});
        
            if (!userObj){
                return res.status(400).json({message:"No user found"});
            } else {
                return res.status(200).json(userObj);
            }

            
        } catch(error) {
            console.log(error.message); 
            return res.status(400).json({message:error.message});
        }
    },

    //Método invocado quando recebe uma requisição POST
    async store (req, res){
        //console.log (req.body); //mostrar a requisição POST no console
        //console.log (req.file); //mostrar a requisição POST no console
        
        //pega os campos do body
        const { userID, name, password, email } = req.body;

        //pega o campo filename que foi processado e renomeia para image 
        const {filename: image} = req.file;

        //separa o nome e extensão da imagem
        const [imgName, ext] = image.split('.');
        const fileName = `${imgName}_small.jpg`;

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
        fs.unlinkSync(req.file.path);
        
        //Cria o usuário no DB MONGO
        try {
            const userObj = await User.create({
                userID,
                name,
                password,
                email,
                userImage: fileName,
            });
            return res.status(201).json(userObj);
        } catch(error) {
            console.log(error.message); // 'E11000 duplicate key error...'
            return res.status(400).json({message:error.message});
        }
    },

    //Método invocado quando recebe uma requisição PUT
    async update (req, res){
        const userID = req.params.userID;
        //console.log (req.body); //mostrar a requisição no console
        //console.log (req.file); //mostrar a requisição no console
        
        
        try {
            const userObj = await User.findOne({userID:userID});
            if (!userObj){
                return res.status(400).json({message:"user not found"});
            } else {
                // console.log(req.body);
                // console.log(userObj);
                username = req.body.name == undefined ? userObj.name : req.body.name;
                password = req.body.password == undefined ? userObj.password : req.body.password;
                email = req.body.email == undefined ? userObj.email : req.body.email;
                // console.log(name, password, email);

                if (req.file !== undefined){
                    //console.log(req.file);
                    //pega o campo filename que foi processado e renomeia para image 
                    var {filename: image} = req.file;
                    //separa o nome e extensão da imagem
                    const [fname, fext] = image.split('.');
                    const fileName = `${fname}_small.jpg`;

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
                    fs.unlinkSync(req.file.path);
                } else {
                    image = userObj.userImage;
                }
                
                // console.log(image);
                // console.log(userObj);

                //Atualiza dados do usuário no DB
                User.updateOne(
                    {_id:userObj._id},
                    {
                        name: username,
                        password: password,
                        email:email,
                        userImage: image,
                    },()=>{}
                );
                userObj.name = username;
                userObj.userImage= image;
                userObj.email=email;
                return res.status(200).json(userObj);
            }

            
        } catch(error) {
            console.log(error.message); 
            return res.status(400).json({message:error.message});
        }
        
    //    return res.status(200).json({ok:true});
    }
};