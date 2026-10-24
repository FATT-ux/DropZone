'use client'
import React, { useEffect, useState } from 'react'
import api from '../../Lib/axios';
import styles from './Filter.module.css';

interface filterType {
    selected: string | null, //null нужен потому что у кнопки где все стоит null
    setSelected: (obj:string | null) => void;
}

export default function Filter({ selected, setSelected} : filterType) { //пропсы и тип
    const [types, setTypes] = useState<string[]>([]);

    useEffect(()=>{
        const getData = async () =>{
            try{
                const res = await api.get('/api/filter');
                setTypes(res.data.map((t: { type: string }) => t.type)); //Это превращает [{type: "Обувь"}] в ["Обувь"]
            } catch(err){
                console.log('Ошибка', err)
            }
        }
        getData();
    },[])

  return (
    <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${selected === null ? styles.active : ''}`} onClick={()=> setSelected(null)}>Все</button>

        {types.map(obj => (
            <button key={obj} className={`${styles.filterBtn} ${selected === obj ? styles.active : ''}`} onClick={() => setSelected(obj)}>{obj}</button>
        ))}
    </div>
  )
}