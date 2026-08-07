'use client';

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 24px',
      borderRadius: '12px',
      background: type === 'success' ? '#22c55e' : '#e5484d',
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      animation: 'slideUp 0.3s ease forwards',
      maxWidth: '320px',
    },
  };

  return (
    <div style={styles.container}>
      {type === 'success' ? 'Berhasil' : 'Gagal'} {message}
    </div>
  );
}
