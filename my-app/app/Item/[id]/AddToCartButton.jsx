'use client';
import { useState } from 'react';
import api from '../../Lib/axios';
import { useRouter } from 'next/navigation';
import styles from './Item.module.css';

export default function AddToCartButton({ productId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }

        setLoading(true);
        try {
            await api.post('/basket',
                { product_id: productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Товар добавлен в корзину');
        } catch (err) {
            console.error('Ошибка добавления:', err);
            alert('Не удалось добавить в корзину');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className={styles.btn} 
            onClick={handleAddToCart}
            disabled={loading}
        >
            {loading ? 'Добавление...' : 'Добавить в корзину'}
        </button>
    );
}