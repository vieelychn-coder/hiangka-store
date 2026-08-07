'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/ProductCard.module.css';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || product.image_url || product.thumbnail || '';

  return (
    <Link href={`/detail/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.price}>Rp {product.price.toLocaleString('id-ID')}</div>
        <div className={styles.rating}>★ {product.rating}</div>
        <div className={styles.sold}>{product.sold} sold</div>
      </div>
    </Link>
  );
}
