import './globals.css'
import {ReactNode} from "react";

export const metadata = {
  title: 'David Chien',
  description: 'A student passionate about web development. Get in touch with me to know more.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
