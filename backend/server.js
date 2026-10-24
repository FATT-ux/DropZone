const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const authRouter = require('./authRouter');
const pagRouter = require('./pagRouter');
const basketRouter = require('./basketRouter')
const favoritesRouter = require('./favoritesRouter')
const { query } = require('express-validator');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/auth', authRouter);
app.use('/pag' , pagRouter);
app.use('/basket', basketRouter);
app.use('/favorites', favoritesRouter);

app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        console.log('Ошибка запроса', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/api/categories/:id/products', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE category_id = $1 ORDER BY id',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.log('Ошибка запроса', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/search', async (req, res) => {
    try{
        const {query} = req.query;

        if (!query || query.trim() === ''){ // trim удаляет пробелы
            return res.json({ products: [] });
        }

        const result = await pool.query(
            `SELECT * FROM products
            WHERE name ILIKE $1 OR description ILIKE $1
            ORDER BY id
            LIMIT 10`,
            [`%${query}%`]
        );

        res.json({
            products: result.rows,
            total: result.rows.length
        });
    } catch(err){
        console.log("Ошибка связанная с поиском", err)
    }
})

app.get('/api/products/:id', async (req, res) =>{
    const {id} = req.params; //достаем id из url
    try{
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0){
            return res.status(404).json({message: 'Товар не найден'})
        }
        res.json(result.rows[0]);
    } catch(err){
        console.log("Ошибка запроса", err);
    }
})

app.get('/api/products/:id/details', async(req, res) => {
    const {id} = req.params;
    try{
        const result = await pool.query(
            'SELECT * From product_details WHERE product_id = $1',
            [id]
        )
        if (result.rows.length ===0){
            return res.status(404).json(null);
        }
        res.json(result.rows[0]);
    } catch(err) {
        console.log('Ошибка характеристики', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
})

app.get('/api/filter', async (req,res) => {
    try{
        const result = await pool.query(
            "SELECT DISTINCT type FROM products WHERE type IS NOT NULL ORDER BY type"
        );
        res.json(result.rows);

    } catch(err){
        console.log("Ошибка фильтрации", err);
        res.status(500).json({message: "Ошибка на стороне сервера"});
    }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен http://localhost:${PORT}`);
});