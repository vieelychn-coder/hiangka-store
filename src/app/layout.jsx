export const metadata = {
  title: 'HIANKA Store',
  description: 'Premium Limited Drop Marketplace',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  );
}
