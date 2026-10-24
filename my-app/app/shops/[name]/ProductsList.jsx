'use client'
import React, { useEffect, useState } from 'react'
import api from '../../Lib/axios';
import ShopCard from '../../components/ShopCard/ShopCard';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ShopCard.module.css';
import Filter from './Filter';

export default function ProductsList({shopId}) {

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [selected, setSelected] = useState(null); 

    const limit = 12;

   useEffect(() => {
    const getData = async () => {
        setIsLoading(true);
        try {
            let url = `/pag/pagination?categoryId=${shopId}&page=${page}&limit=${limit}`;
            if (selected) {
                url += `&type=${encodeURIComponent(selected)}`;
            }

            const res = await api.get(url);
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Ошибка загрузки товаров:', err);
        } finally {
            setIsLoading(false);
        }
    };
    getData();
}, [shopId, page, selected]);

    const pageChange = (newPage) =>{
        setPage(newPage); //переключаем страницу
        window.scroll({ top: 0, behavior: 'smooth'}); // на самый вверх
    }

    const handleSelectType = (type) => {
        setSelected(type);
        setPage(1);
    };

    if (isLoading) return <p>Загрузка...</p>;

  return (
     <>
            <Filter selected={selected} setSelected={handleSelectType}/>

            <div className={styles.ShopCard}>
                {products.length === 0 ? (
                    <p>В этом магазине нет товаров</p>
                ) : (
                    products.map(product => (
                        <ShopCard key={product.id} {...product} />
                    ))
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={pageChange}
            />
        </>
  )
}