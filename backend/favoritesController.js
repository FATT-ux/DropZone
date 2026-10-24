const pool = require('./db');

const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT f.id, f.created_at, p.id AS product_id, p.name, p.price, p.image
             FROM favorites f
             JOIN products p ON p.id = f.product_id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.log('Ошибка избранного:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const addFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        await pool.query(
            `INSERT INTO favorites (user_id, product_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, product_id) DO NOTHING`,
            [userId, product_id]
        );

        res.json({ message: 'Добавлено в избранное' });
    } catch (err) {
        console.log('Ошибка добавления:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;   

        const result = await pool.query(
            'DELETE FROM favorites WHERE product_id = $1 AND user_id = $2 RETURNING id',
            [productId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Товар не найден в избранном' });
        }

        res.json({ message: 'Удалено из избранного' });
    } catch (err) {
        console.log('Ошибка удаления:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const result = await pool.query(
            'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        res.json({ isFavorite: result.rows.length > 0 });
    } catch (err) {
        console.log('Ошибка проверки:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { getFavorites, addFavorites, removeFromFavorites, checkFavorite };