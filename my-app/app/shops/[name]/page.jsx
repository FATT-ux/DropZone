import api from '../../Lib/axios';
import { notFound } from 'next/navigation';
import ProductsList from './ProductsList';
import styles from './ShopCard.module.css';

export default async function ShopPage({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const response = await api.get('/api/data');
  const shops = response.data;

  const shop = shops.find(
    s => s.name.toLowerCase() === decodedName.toLowerCase()
  );

  if (!shop) notFound();

  return (
    <div>
      <h1 className={styles.title}>{shop.name}</h1>
      <ProductsList shopId={shop.id} />
    </div>
  );
}