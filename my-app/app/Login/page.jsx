'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import styles from './Login.module.css';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/auth/login',
        form
      );

      // Сохраняем токен и пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Переходим на главную
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.log}>
      <div className={styles.logPage}>
        <h1 className={styles.title}>Авторизоваться</h1>

        <p className={styles.desc}>
          Если нет аккаунта —{' '}
          <Link href="/Registration" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            className={styles.phoneNumber}
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className={styles.phoneNumber}
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}