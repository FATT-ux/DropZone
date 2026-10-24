'use client';
import React, { useEffect, useState } from 'react';
import styles from './Basket.module.css';
import Link from 'next/link';
import api from '../Lib/axios';
import { useBasket } from '../context/BasketContext';

interface Items{
    id: number,
    name: string,
    price: string,
    quantity: number,
    image: string,
}

export default function BasketPage() {
    const [items, setItems] = useState<Items[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {setCountBasket} = useBasket();

    useEffect(() => {
        const fetchBasket = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Войдите в аккаунт, чтобы увидеть корзину");
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/basket', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setItems(res.data);
                setCountBasket(res.data.length);
            } catch (err: any) {
                console.error('Ошибка корзины:', err);
                setError('Не удалось загрузить корзину');
            } finally {
                setLoading(false);
            }
        };
        fetchBasket();
    }, [setCountBasket]);

    const remove = async (cartItemId: number) => {
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/basket/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
          const newItems = items.filter(item => item.id !== cartItemId); //можно сразу писать setItems но из-за контекста
          setItems(newItems) 
          setCountBasket(newItems.length)

        } catch (err: any) {
            console.log("Ошибка удаления", err);
        }
    };

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    return (
        <div className={styles.container}>
            {loading && <p className={styles.message}>Загрузка...</p>}

            {error && !loading && (
                <p className={styles.error}>{error}</p>
            )}

            {!loading && !error && items.length === 0 && (
                <div className={styles.empty}>
                    <h3 className={styles.emptyTitle}>В корзине пока пусто</h3>
                    <p className={styles.emptyDesc}>Загляните на главную — собрали там магазины, которые могут вам понравиться</p>
                    <Link href='/' className={styles.emptyBtn}>Перейти на главную</Link>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <>
                    <div className={styles.items}>
                        {items.map(item => (
                            <div key={item.id} className={styles.item}>
                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    alt={item.name}
                                    className={styles.image}
                                />
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{item.name}</h3>
                                    <p className={styles.price}>{item.price} р.</p>
                                    <p className={styles.quantity}>
                                        Количество: {item.quantity}
                                    </p>
                                </div>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => remove(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.total}>
                        <span>Итого:</span>
                        <span className={styles.totalPrice}>{total} р.</span>
                    </div>
                </>
            )}
        </div>
    );
}