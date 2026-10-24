const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const pool = require('./db');

const generateAccessToken = (id, username) => {
    const payload = { id, username };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors: errors.array() });
            }

            const { username, password, email } = req.body;

            
            const candidate = await pool.query(
                'SELECT id FROM users WHERE username = $1 OR email = $2',
                [username, email]
            );
            if (candidate.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            
            const result = await pool.query(
                `INSERT INTO users (username, email, password_hash) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, username, email, created_at`,
                [username, email, hashPassword]
            );

            const user = result.rows[0];

            
            const token = generateAccessToken(user.id, user.username);

            return res.json({
                message: 'Пользователь успешно зарегистрирован',
                user,
                token
            });
        } catch (e) {
            console.log('Ошибка регистрации:', e);
            res.status(500).json({ message: 'Ошибка регистрации' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

        
            const result = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            const user = result.rows[0];

            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` });
            }

           
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(400).json({ message: 'Введён неверный пароль' });
            }

            
            const token = generateAccessToken(user.id, user.username);

            return res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (e) {
            console.log('Ошибка входа:', e);
            res.status(500).json({ message: 'Ошибка входа' });
        }
    }

    async getUsers(req, res) {
        try {
            const result = await pool.query(
                'SELECT id, username, email, created_at FROM users ORDER BY id'
            );
            res.json(result.rows);
        } catch (e) {
            console.log('Ошибка получения пользователей:', e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new authController();