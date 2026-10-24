'use client'
import React, { useEffect, useState } from 'react'
import styles from './profile.module.css'
import { FaHeart, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { RiShoppingBasketLine } from "react-icons/ri";
import { IoQrCodeSharp } from "react-icons/io5";
import { useFavorites } from '../context/FavoritesContext';
import { useBasket } from '../context/BasketContext';
import Link from 'next/link';

interface User {
  username: string;
  id: number;
  email: string;
}

export default function ProfilePage() {

  const {countFavorites} = useFavorites(); //это useContext
  const {countBasket} = useBasket();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  
    localStorage.removeItem('user');  
    setUser(null);
    window.location.href = '/';        
};

  if (isLoading) {
    return <div className={styles.container}><p>Загрузка...</p></div>;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>Войдите в аккаунт, чтобы просмотреть профиль</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Большой фоновый текст DropZone */}
      <div className={styles.bgWatermark}>DropZone</div>

      <div className={styles.profileHeader}>
        <FaUserCircle className={styles.avatarDeff} />
        <div className={styles.userInfo}>
          <h1 className={styles.name}>{user.username}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Выйти">
          <FaSignOutAlt /> Выйти
        </button>
      </div>

      <div className={styles.block}>

        <Link href='/Favorites' className={styles.blockDesc}>
          <div className={styles.blockInfo}>
            <p className={styles.blockText}>Избранное</p>
            <p className={styles.blockTextWrapper}>{countFavorites} товаров</p>
          </div>
          <FaHeart className={styles.icons}/>
        </Link>

        <div className={styles.blockDesc}>
          <div className={styles.blockInfo}>
            <p className={styles.blockText}>Заказы</p>
            <p className={styles.blockTextWrapper}>0 активных</p>
          </div>
          <IoQrCodeSharp className={styles.icons}/>
        </div>

        <Link href='/Basket' className={styles.blockDesc}>
          <div className={styles.blockInfo}>
            <p className={styles.blockText}>Корзина</p>
            <p className={styles.blockTextWrapper}>{countBasket} всего</p>
          </div>
          <RiShoppingBasketLine className={styles.icons}/>
        </Link>
      </div>
    </div>
  )
}
