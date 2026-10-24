'use client'
import React, { useState } from 'react'
import styles from './Characteristic.module.css'
import api from '../../Lib/axios';
import { useEffect } from 'react';

export default function Characteristic({id}) {
    const [activeButton ,setActiveButton] = useState(1);
    const [data, setData] = useState([]);

    const active =  (buttonName) =>{
        setActiveButton(buttonName);
    }

    useEffect(() => {
     const getData = async () =>{
      try{
        const res = await api.get(`/api/products/${id}/details`);
        setData(res.data);
      } catch(err){
        console.log('Нет характеристик:', err);
      }
     }
     getData();
    }, [id])

  return (
    <div>
        <div className={styles.container}>
          <p className={`${styles.btn} ${activeButton === 1 ? styles.active : null}`}
           onClick={() => {active(1)}} 
           >Характеристики</p>
          <p className={`${styles.btn} ${activeButton === 2 ? styles.active : null}`} onClick={() => setActiveButton(2)}>Доставка</p>
          <p className={`${styles.btn} ${activeButton === 3 ? styles.active : null}`} onClick={() => setActiveButton(3)}>Размерная сетка</p>
        </div>

        <div className={styles.info}>
            {activeButton == 1 ? (
              <div className={styles.infoDetails}>
                    <p className={styles.details}><strong>-Бренд: {data.brand}</strong></p>
                    <p className={styles.details}><strong>-Состав: {data.material}</strong></p>
                    <p className={styles.details}><strong>-Цвет: {data.color}</strong></p>
                    <div className={styles.detailsText}>
                      <h1 className={styles.detailsTextTitle}>Описание</h1>
                      {data.seller_comment ? (
                        <p className={styles.detailsTextDesc}>{data.seller_comment}</p>
                        ) : (
                          <p className={styles.detailsTextDesc}>Описания нет</p>
                        )
                      }
                    </div>
              </div>
            ) : null}

            {activeButton == 2 ? (
              <div className={styles.infoDelivery}>
                <p className={styles.infoDeliveryDesc}>Доставка осуществляется транспортной компанией CDEK, Почта России, Boxberry, DPD, Яндекс Доставка</p>
                <p className={styles.infoDeliveryDesc}>Доставка по России с момента отправки занимает от 2 до 14 рабочих дней
                Доставка по СНГ с момента отправки (Беларусь , Казахстан) занимает от 5 до 14 рабочих дней
                Заказы в другие страны оформляются только на почту поддержке: <a className={styles.mail} href="mailto:nik.abaskalov@mail.ru">nik.abaskalov@mail.ru</a></p>
                <p className={styles.infoDeliveryDesc}>Отправка товара в течение двух рабочих дней из
               <br /> г. Абакан</p>
              </div>
            ) : null}

            {activeButton == 3 ? (
              <div className={styles.infoImg}>
                {data.size_chart ? (
                  <img src={`http://localhost:5000${data.size_chart}`} className={styles.imgSize} alt="Размерная сетка" />
                ) : (
                  <p>Размерная сетка отсутствует</p>
                )}
              </div>
            ) : null}

        </div>


    </div>


  )
}