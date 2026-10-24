import React from 'react';
import styles from './Item.module.css';
import api from '../../Lib/axios';
import Link from 'next/link';
import Characteristic from '../../components/Characteristic/Characteristic';
import Back from '../../components/BackButton/Back';
import AddToCartButton from './AddToCartButton';   

export default async function Page({ params }) {
    const { id } = await params;

    const response = await api.get(`/api/products/${id}`);
    const re = response.data;

    return (
        <div className={styles.main}>
            <div className={styles.back}><Back /></div>

            <div className={styles.products}>
                <img 
                    src={`http://localhost:5000${re.image}`} 
                    alt={re.name} 
                    className={styles.img} 
                />
                <div className={styles.text}>
                    <p className={styles.title}>{re.name}</p>
                    <p className={styles.price}>{re.price} р.</p>

                    <label className={styles.label} htmlFor='size'>Размер</label>
                    <select className={styles.option} id='size'>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>

                    <div className={styles.button}>
                        <AddToCartButton productId={id} />          
                        <button className={`${styles.btn} ${styles.btnBuyNow}`}>
                            Купить сейчас
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.ImgCard}></div>

            <div className={styles.characteristic}>
                <Characteristic id={id} />
            </div>
        </div>
    );
}