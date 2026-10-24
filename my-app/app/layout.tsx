import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header/Header'
import FavoritesProvider from './context/FavoritesContext' 
import BasketProvider from "./context/BasketContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DropZone"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <BasketProvider>
        <FavoritesProvider>
          <Header/>
          <div className="container">{children}</div> 
        </FavoritesProvider>
        </BasketProvider>
      </body>
    </html>
  );
}
