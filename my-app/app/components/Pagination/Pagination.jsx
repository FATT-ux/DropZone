'use client'
import React from 'react'
import styles from './Pagination.module.css'
export default function Pagination({page, totalPages, onPageChange}) {
  if (totalPages <= 1){
    return null;
  }

  return (
    <div className={styles.pagination}>
{/* disabled={page === 1} //блочит кнопку если мы хотим переключиться на 0 слайд */}
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className={styles.btn}>
        ←
      </button>

      {Array.from({length: totalPages}, (_, i) => i + 1).map(p =>(
        <button key={p} onClick={() => onPageChange(p)} className={`${styles.btn} ${p === page ? styles.active : ''}`}>
          {p}
        </button>
      ))}

  {/* disabled={page === totalPages} //блочит кнопку если на послед кнопке */}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className={styles.btn}> 
        →
      </button>

    </div>
  )
}
