import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Home.module.css';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(8);
  if (error) return [];
  return data;
}

async function getStats() {
  let totalProducts = 0;
  let totalOrders = 0;

  try {
    const { count: products, error: err1 } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    if (!err1) totalProducts = products || 0;
  } catch {
    totalProducts = 0;
  }

  try {
    const { count: orders, error: err2 } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    if (!err2) totalOrders = orders || 0;
  } catch {
    totalOrders = 0;
  }

  return { products: totalProducts, orders: totalOrders, rating: '4.9' };
}

export default async function Home() {
  const [products, stats] = await Promise.all([getProducts(), getStats()]);
  const categories = ['Semua', 'Fashion', 'Accessories', 'Footwear', 'Art & Print', 'Lifestyle'];

  return (
    <div className={styles.page}>
      <Navbar />

      <div className="container">
        <div className={styles.hero}>
          <p className={styles.heroTag}>Limited Drop</p>
          <h2 className={styles.heroTitle}>Premium Streetwear</h2>
          <p className={styles.heroDesc}>Koleksi eksklusif dengan jumlah terbatas.</p>
          <div className={styles.heroButtons}>
            <Link href="/products" className={styles.heroBtnPrimary}>Shop Now</Link>
            <Link href="/products" className={styles.heroBtnSecondary}>Explore</Link>
          </div>
          <div className={styles.heroStats}>
            <span>⭐ {stats.rating}</span>
            <span>{stats.orders}+ Orders</span>
            <span>{stats.products} Products</span>
          </div>
        </div>

        <div className="category-scroll">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              href={`/products?category=${cat === 'Semua' ? 'all' : cat}`}
              className="category-chip"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className={styles.sectionTitle}>
          <h2>Best Seller</h2>
          <Link href="/products">Lihat Semua →</Link>
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="footer">
        <div className="container">
          <div className="brand">HIANKA</div>
          <p>Premium Limited Drop Marketplace</p>
          <p className={styles.footerCredit}>Designed & Developed by Viee Lychn</p>
        </div>
      </div>
    </div>
  );
}
