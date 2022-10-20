const multer = require('multer'); //processa formulários POST
const path = require('path'); //formata caminhos

//Processa o upload da imagem para a pasta uploads com o nome original
module.exports = {
    storage: new multer.diskStorage({
        destination: path.resolve(__dirname,'..','..','uploads','original'),
        filename: function(req, file, callback){
            callback(null,file.originalname);
        }
    })
}; //path.resolve = resolve caminhos à partir do diretório atual
 