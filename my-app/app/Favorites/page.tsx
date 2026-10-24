'use client';
import React, { useEffect, useState } from 'react';
import styles from './Favorites.module.css';
import api from '../Lib/axios';
import { FaHeart } from "react-icons/fa";
import Link from 'next/link';
import { useFavorites } from '../context/FavoritesContext';

interface Data{
    id: number,
    name: string,
    price: string,
    image: string,
    product_id: number,
    created_at: string;
}


export default function FavoritesPage() {
    const [data, setData] = useState<Data[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { setCountFavorites } = useFavorites();  //для UseContext

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Войдите в аккаунт, чтобы увидеть избранное');
                setLoading(false);
                return;
            }

            try {
                const result = await api.get('/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(result.data);
                setCountFavorites(result.data.length); // для контекста
            } catch (err: any) {
                console.log('Не удалось получить данные', err);

                if (err.response?.status === 401) {
                    setError('Войдите в аккаунт, чтобы увидеть избранное');
                } else {
                    setError('Не удалось загрузить избранное');
                }
            } finally {
                setLoading(false);   
            }
        };
        getData();
    }, [setCountFavorites]);


    const click = async (productId: number) => {
        const token = localStorage.getItem('token');
        if(!token) return;

        try{
            await api.delete(`/favorites/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            //можно сразу писать setData но из-за контекста мы пишем так
           const newData = data.filter(item => item.product_id !== productId); //обновляем список 
            setData(newData);
            setCountFavorites(newData.length);
        }catch (err) {
            console.log('Ошибка удаления:', err);
        }
    } 

    return (
        <div className={styles.container}>
            {loading && <p className={styles.message}>Загрузка...</p>}
            
                <div className={styles.grid}>
                    {data.map((obj) => (
                        <div key={obj.id} className={styles.card}>
                            <img
                                src={`http://localhost:5000${obj.image}`}
                                alt={obj.name}
                                className={styles.image}
                            />
                            <div className={styles.info}>
                            <h3 className={styles.name}>{obj.name}</h3>
                            <p className={styles.price}>{obj.price} р.</p>
                            </div>

                            <FaHeart  className={styles.heart} onClick={() => click(obj.product_id)}/>
                        </div>
                    ))}
                </div>
        </div>
    );
}