'use client';
import React, { useState, useEffect } from 'react';
import styles from './ShopCard.module.css';
import { FaHeart } from "react-icons/fa";
import api from '../../Lib/axios';
import { useRouter } from 'next/navigation';

export default function AddToFavorites({ productId }) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);   
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const check = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await api.get(`/favorites/check/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(res.data.isFavorite);
            } catch (err) {
                console.log('Ошибка проверки:', err);
            }
        };
        check();
    }, [productId]);

    const click = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/Login');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            if (isFavorite) {
                await api.delete(`/favorites/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(false);
            } else {
                await api.post('/favorites',
                    { product_id: productId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(true);
            }
        } catch (err) {
            console.log('Ошибка:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <span
            className={isFavorite ? styles.favoritesActive : styles.favorites}
            onClick={click}
        >
            <FaHeart />
        </span>
    );
}