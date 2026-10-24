const pool = require('./db');

const getBasket = async (req, res) =>{
    try{
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price, p.image
             FROM cart c
             JOIN products p ON p.id = c.product_id
             WHERE c.user_id = $1
             ORDER BY c.id`,
            [userId]
        );
        res.json(result.rows);
    } catch(err){
        console.log('Ошибка корзины:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

const addBasket = async (req, res) =>{
    try{
        const userId = req.user.id;
        const { product_id, quantity = 1} = req.body;

        const existing = await pool.query(
            'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, product_id]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                'UPDATE cart SET quantity = quantity + $1 WHERE id = $2',
                [quantity, existing.rows[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, product_id, quantity]
            );
        }

        res.json({ message: 'Добавлено в корзину' });

    } catch(err){
        console.log('Ошибка добавления:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

const removeFromBasket = async (req, res) =>{
    try{
        const userId = req.user.id;
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        res.json({ message: 'Удалено из корзины' });
    } catch(err){
        console.log('Ошибка удаления:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

module.exports = { getBasket, addBasket, removeFromBasket };