const Router = require('express');
const router = new Router();
const controller = require('./basketController');
const authMiddleware = require('./authMiddleware');

router.get('/', authMiddleware, controller.getBasket);
router.post('/', authMiddleware, controller.addBasket);
router.delete('/:id', authMiddleware, controller.removeFromBasket);

module.exports = router;