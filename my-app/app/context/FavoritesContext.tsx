'use client'
import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { createContext } from 'react'
import api from '../Lib/axios';

interface Counter{
    countFavorites: number,
    setCountFavorites: (count: number) => void;
}

const FavoritesContext = createContext<Counter | undefined>(undefined);

export default function FavoritesProvider({ children }: {children: ReactNode}) {
    const [countFavorites, setCountFavorites] = useState<number>(0);

     useEffect(() => {
        const fetchCount = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await api.get('/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Обновляем глобальный стейт
                setCountFavorites(res.data.length);
            } catch (err) {
                console.log('Ошибка загрузки счетчика корзины', err);
            }
        };

        fetchCount();
    }, []);

  return (
    <FavoritesContext.Provider value={{countFavorites, setCountFavorites}}>
        {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() { //кастомный хук
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error('useFavorites должен использоваться внутри FavoritesProvider');
    }
    
    return context;   
}