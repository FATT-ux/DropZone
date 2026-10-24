const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require('express-validator');

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(), //это валидация проверка 
    check('username', 'Имя пользователя должно быть от 3 до 50 символов').isLength({ min: 3, max: 50 }),
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Пароль должен быть не менее 4 символов').isLength({ min: 4 })
], controller.registration);

router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;