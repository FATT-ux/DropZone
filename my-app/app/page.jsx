'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Shop from './components/Shop/Shop'

export default function page() {

  const [isloading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() =>{
    const getData = async () =>{
      try{
        const res = await axios.get('/api/data');
        setData(res.data);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(!isloading);
      }
    }
    getData();
  },[])

  return (
    <main className='main'>
      {isloading ? (<p>Загрузка данных...</p>) : (
        <div className='mainIcons'>
          {data.map(el => <Shop key={el.id} {...el}/>)}
        </div>
      )}
    </main>
  )
}
