const Publi = require('../models/Publi');

module.exports = {
    //Método invocado quando recebe uma requisição POST de LIKE
    async store (req, res){
        //recupera o registro no DB baseado no id passado na URL
        const postLike = await Publi.findById(req.params.id);
        
        postLike.likes += 1;

        await postLike.save();

        //atualiza por socket
        req.io.emit('newlikeSocket',postLike);

        //para testes: return res.json({ ok:true});
        return res.json(postLike);
    }
   
};