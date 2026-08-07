import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'HIANKA Store - Premium Limited Drop Marketplace',
  description: 'Temukan produk limited edition terbaik dari HIANKA Store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
