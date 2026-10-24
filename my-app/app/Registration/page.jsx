'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import styles from './Registration.module.css';

export default function Registration() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
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
        'http://localhost:5000/auth/registration',
        form
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            className={styles.input}
            placeholder="Почта"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            type="text"
            className={styles.input}
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className={styles.input}
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.desc}>
          Уже есть аккаунт? <Link href="/Login" className={styles.link}>Войти</Link>
        </p>
      </div>
    </div>
  );
}