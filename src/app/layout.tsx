import type { Metadata } from 'next'
import { Bebas_Neue, IBM_Plex_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Desmadrugados Bar — Tu lugar preferido',
  description: 'Cerveza, licores, cigarrillos y el mejor ambiente. Tu lugar para relajarte con los amigos.',
  keywords: 'bar, cervezas, licores, ambiente nocturno, Desmadrugados',
  openGraph: {
    title: 'Desmadrugados Bar — Tu lugar preferido',
    description: 'Cerveza y amigos, la mezcla perfecta.',
    type: 'website',
    images: [{ url: '/images/bar-1.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${bebasNeue.variable} ${ibmPlexMono.variable} font-mono antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
