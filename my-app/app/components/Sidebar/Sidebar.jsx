'use client'
import React from 'react'
import styles from './Sidebar.module.css'
export default function Sidebar({open, setOpen}) {
  return (
    <aside className={styles.aside}>
        <span className={styles.close} onClick={() => setOpen(!open)}>x</span>

        <div className={styles.text}>
          <p className={styles.desc}>das</p>
          <p className={styles.desc}>da</p>
        </div>
    </aside>
  )
}
