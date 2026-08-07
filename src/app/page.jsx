import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>HIANKA Store</h1>
        <p style={styles.subtitle}>Premium Limited Drop Marketplace</p>
        <div style={styles.buttons}>
          <Link href="/products" style={styles.button}>Lihat Produk</Link>
          <Link href="/login" style={styles.button}>Login</Link>
          <Link href="/register" style={styles.button}>Daftar</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    padding: '20px',
  },
  card: {
    background: '#1a1a2e',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #2a2a2a',
  },
  title: {
    color: '#c9a227',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: '16px',
    marginTop: '8px',
    marginBottom: '24px',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #c9a227, #e5484d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
};
