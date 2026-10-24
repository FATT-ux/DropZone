//Middleware для корзины смотреть какой пользователь авторизирован

const jwt = require("jsonwebtoken");
const {secret} = require("./config");

module.exports = function (req,res, next){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message: 'Нет токена'})
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);

        req.user = decoded; // id, username
        next();
    } catch(err){
        return res.status(401).json({message: 'Невалидный токен'})
    }
}