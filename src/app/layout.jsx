import '../styles/globals.css';

export const metadata = {
  title: 'HIANKA Store - Premium Limited Drop Marketplace',
  description: 'Temukan produk limited edition terbaik dari HIANKA Store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
