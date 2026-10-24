'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from './Header.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { GiHamburgerMenu } from "react-icons/gi";
import { RiShoppingBasketLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Sidebar from '../Sidebar/Sidebar'

export default function Header() {
    const router = useRouter();  
    const [open, setOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    //для умного поиска
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const searchRef = useRef(null); 

    useEffect(() =>{
        const storedUser = localStorage.getItem('user')
        if (storedUser){
            setUser(JSON.parse(storedUser));
        }
    }, [])

   
    useEffect(() => { //умный поиск
        if (searchQuery.trim() === '') {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingSearch(true);
            try {
                const res = await fetch(
                    `http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`
                );
                const data = await res.json();
                setResults(data.products);
                setShowDropdown(true);
            } catch (err) {
                console.log('Ошибка поиска:', err);
            } finally {
                setLoadingSearch(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => { 
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
        router.refresh();
    }

    const handleSearch = (e) =>{
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search?query=${encodeURIComponent(q)}`);
            setShowDropdown(false); // закрываем при отправке
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href='/' className={styles.linkHome}><span>DropZone</span></Link>
                    <GiHamburgerMenu className={styles.burger} onClick={() => setOpen(!open)}/>
                        {open ? <Sidebar open={open} setOpen={setOpen}/> : null}
                    </div>

                <div className={styles.searchWrap} ref={searchRef}>
                    <form className={styles.inputSearch} onSubmit={handleSearch}>
                        <input 
                            type="search"  
                            className={styles.search} 
                            placeholder='Найти на DropZone'  
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {showDropdown && searchQuery.trim() && (
                        <div className={styles.dropdown}>
                            {loadingSearch ? (
                                <p className={styles.dropdownText}>Поиск...</p>
                            ) : results.length === 0 ? (
                                <p className={styles.dropdownText}>Ничего не найдено</p>
                            ) : (
                                results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/Item/${product.id}`}
                                        className={styles.dropdownItem}
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <img
                                            src={`http://localhost:5000${product.image}`}
                                            alt={product.name}
                                            className={styles.dropdownImage}
                                        />
                                        <div>
                                            <p className={styles.dropdownName}>{product.name}</p>
                                            <p className={styles.dropdownPrice}>{product.price} ₽</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <nav className={styles.headerNav}>
                    <ul className={styles.headerList}>

                        {user ? (
                            <div className={styles.proba}>
                            
                            <Link href='/Favorites' className={styles.userBlock}>
                                <div className={styles.userBlock}>
                                    <FaHeart  className={styles.icons} />
                                    <span className={styles.link}>Избранное</span>
                                </div>
                            </Link>

                <div className={styles.userBlock} onMouseEnter={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>
                    <FaRegUserCircle className={styles.icons} />
                    <span className={styles.username}>{user.username}</span>

                    {userMenu ? (
                        <div className={styles.Menu}>
                         <Link href='/profile' className={styles.menuBtn}>Профиль</Link>
                         <p className={styles.menuBtn}>Покупки</p>
                         <Link href='/Favorites' className={styles.menuBtn}>Избранное</Link>
                         <p onClick={handleLogout} className={styles.menuBtn}>Выйти</p>
                     </div>
                 ) : null}
                </div>
                        </div>
                            
                        ):(
                            <Link href='/Login' className={styles.link}>
                                <div className={styles.list}>
                                    <FaRegUserCircle className={styles.icons} />
                                    <span className={styles.link}>Войти</span>
                                </div>
                            </Link>
                        )}

                            <Link href='/Basket' className={styles.link}>
                                <div className={styles.list}>
                                    <RiShoppingBasketLine className={styles.icons}/>
                                    <span className={styles.link}>Корзина</span>
                                </div>
                        </Link>
                    </ul>
                </nav>
            </div>
        </header>
      )
}