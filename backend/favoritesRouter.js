const Router = require('express');
const router = new Router();
const controller = require('./favoritesController');
const authMiddleware = require('./authMiddleware');

router.get('/', authMiddleware, controller.getFavorites);
router.post('/', authMiddleware, controller.addFavorites);
router.get('/check/:productId', authMiddleware, controller.checkFavorite);   
router.delete('/:productId', authMiddleware, controller.removeFromFavorites);   

module.exports = router;