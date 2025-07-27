import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduMath GH | WAEC-Aligned Maths Tutoring for Ghanaian Schools',
  description: 'Personalized online maths tutoring for Ghanaian schools, aligned with WAEC and GES curriculum standards',
  keywords: 'Ghana, WAEC, BECE, WASSCE, Mathematics, Tutoring, Education, Students',
  authors: [{ name: 'EduMath GH' }],
  openGraph: {
    title: 'EduMath GH | Free WAEC Maths Tutoring',
    description: 'Master WAEC Mathematics for free with our Ghana-focused learning platform',
    type: 'website',
    locale: 'en_GH',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GH">
      <body className={inter.className}>{children}
      <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>
         <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-storage-compat.js"></script>
      </body>
    </html>
  );
}