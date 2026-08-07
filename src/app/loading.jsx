import styles from '../styles/ProductCard.module.css';

export default function Loading() {
  return (
    <div className="container" style={{ paddingTop: '16px' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #c9a227 100%)',
        padding: '32px 24px',
        borderRadius: '16px',
        marginBottom: '16px',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ width: '100px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '8px' }}></div>
        <div style={{ width: '200px', height: '30px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', marginBottom: '6px' }}></div>
        <div style={{ width: '150px', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '12px' }}></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '120px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px' }}></div>
          <div style={{ width: '120px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ padding: '5px 14px', background: 'var(--card)', borderRadius: '30px', height: '28px', width: '70px', border: '1px solid var(--border)' }}></div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ width: '120px', height: '24px', background: 'var(--bg)', borderRadius: '4px' }}></div>
        <div style={{ width: '80px', height: '20px', background: 'var(--bg)', borderRadius: '4px' }}></div>
      </div>

      <div className={styles.productGrid}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
              <div className={styles.skeletonLine} style={{ width: '50%' }}></div>
              <div className={styles.skeletonLine} style={{ width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
