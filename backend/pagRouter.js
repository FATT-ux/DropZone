const Router = require('express');
const router = new Router();
const controller = require ('./pagController');

router.get('/pagination', controller.pagination)

module.exports = router;