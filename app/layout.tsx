import './globals.css'
// Using system fonts for Chrome extension compatibility

export const metadata = {
  title: 'NeuroScroll Dashboard',
  description: 'YouTube Shorts behavior analyzer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter">{children}</body>
    </html>
  )
}