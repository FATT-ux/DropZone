'use client';
import React from 'react';
import styles from './Shop.module.css';
import Link from 'next/link';

export default function Shop({ id, name, icon, country, flag }) {
  // Кодируем название для URL, чтобы ссылка была по именни в карточки
  const encodedName = encodeURIComponent(name);
  
  return (
    <Link href={`/shops/${encodeURIComponent(name)}`} className={styles.ShopLink}>
      <div className={styles.ShopCard}>
        <img src={icon} alt={name} className={styles.ShopImg} />
        
        <div className={styles.ShopDetails}>
          <span className={styles.shopName}>{name}</span>
          
          <div className={styles.shopCountryWrapper}>
            <img src={flag} alt={country} className={styles.flag} />
            <p className={styles.shopCountry}>{country}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}