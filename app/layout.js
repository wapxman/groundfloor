import './globals.css'

export const metadata = {
  title: 'GroundFloor',
  description: 'Учёт недвижимости',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
