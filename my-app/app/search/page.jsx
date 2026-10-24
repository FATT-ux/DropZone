import api from '../Lib/axios';
import Link from 'next/link';
import ShopCard from '../components/ShopCard/ShopCard';
import styles from './Search.module.css';

export default async function SearchPage({ searchParams }) {
    const { query } = await searchParams;

    // Если запрос пустой
    if (!query || query.trim() === '') {
        return (
            <div className={styles.container}>
                <Link href='/' className={styles.back}>← На главную</Link>
                <h1 className={styles.title}>Поиск</h1>
                <p className={styles.empty}>Введите запрос в строку поиска</p>
            </div>
        );
    }

    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    const products = response.data.products;

    return (
        <div className={styles.container}>
            <Link href='/' className={styles.back}>← На главную</Link>

            <h1 className={styles.title}>
                Результаты поиска: {query}
            </h1>
            <p className={styles.count}>Найдено: {products.length}</p>

            {products.length === 0 ? (
                <p className={styles.empty}>
                    По запросу "{query}" ничего не найдено
                </p>
            ) : (
                <div className={styles.products}>
                    {products.map(product => (
                        <ShopCard key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
}