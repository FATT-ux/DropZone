'use client'
import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { createContext } from 'react'
import api from '../Lib/axios';

interface Counter{
    countBasket: number,
    setCountBasket: (count: number) => void;
}

//создаёт сам контекст — «контейнер», в который потом положим данные
const BasketContext = createContext<Counter | undefined>(undefined);

//компонент-провайдер. Он оборачивает приложение и предоставляет данные контекста
export default function BasketProvider({children}: {children: ReactNode}) {
    const [countBasket, setCountBasket] = useState<number>(0);

    useEffect(() => {
        const fetchCount = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await api.get('/basket', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Обновляем глобальный стейт
                setCountBasket(res.data.length);
            } catch (err) {
                console.log('Ошибка загрузки счетчика корзины', err);
            }
        };

        fetchCount();
    }, []);

  return (
    <BasketContext.Provider value={{countBasket, setCountBasket}}>
        {children}
    </BasketContext.Provider>
  )
}

//кастомный хук — удобный способ достать контекст.
export function useBasket() {
    const context = useContext(BasketContext);
    if(!context){
        throw new Error('useBasket должен использоваться внутри BasketProvider');
    }
    return context;
}