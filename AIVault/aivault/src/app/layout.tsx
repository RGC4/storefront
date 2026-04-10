import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'AIVault', template: '%s | AIVault' },
  description: 'The marketplace for AI-generated music and video. Upload, sell, and discover.',
  openGraph: {
    type: 'website',
    title: 'AIVault',
    description: 'The marketplace for AI-generated music and video.',
    siteName: 'AIVault',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
