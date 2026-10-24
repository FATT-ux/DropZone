import styles from './ShopCard.module.css';
import { IoStar } from "react-icons/io5";
import { MdCurrencyRuble } from "react-icons/md";
import AddToFavotites from './AddToFavotites';
import Link from 'next/link';

export default function ShopCard({ id, name, description, price, image, rating, reviews_count, in_stock, is_favorite }) {
  return (
    <div className={styles.cardWrap}>
      <Link href={`/Item/${id}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <img src={`http://localhost:5000${image}`} alt={name} className={styles.image} />
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{description}</p>

          <div className={styles.bottom}>
            <p className={styles.price}>
              {price} <MdCurrencyRuble className={styles.rub} />
            </p>
            <p className={styles.rating}>
              <IoStar className={styles.star} />
              <span className={styles.ratingValue}>{Number(rating).toFixed(1)}</span>
              <span className={styles.reviews}>({reviews_count})</span>
            </p>
          </div>
        </div>
      </Link>

      <div className={styles.favorites}>
        <AddToFavotites productId={id}/>
      </div>
      
    </div>
  );
}