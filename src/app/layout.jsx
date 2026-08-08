import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export const metadata = {
  title: 'HIANKA Store - Premium Limited Drop Marketplace',
  description: 'Temukan produk limited edition terbaik dari HIANKA Store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 70px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
