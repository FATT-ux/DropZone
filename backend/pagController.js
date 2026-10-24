const pool = require('./db');

const pagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { categoryId, type } = req.query;

        const conditions = [];
        const params = [];

        if (categoryId) {
            params.push(categoryId);
            conditions.push(`category_id = $${params.length}`);
        }

        if (type) {
            params.push(type);
            conditions.push(`type = $${params.length}`);
        }

        const whereClause = conditions.length > 0 
            ? `WHERE ${conditions.join(' AND ')}` 
            : '';

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM products ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        const productsResult = await pool.query(
            `SELECT * FROM products ${whereClause} ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
            [...params, limit, offset]
        );

        res.json({
            products: productsResult.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.warn('Ошибка пагинации:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { pagination };