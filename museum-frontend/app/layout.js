import './_styles/vendors/_bootstrap-override.scss'
import './_styles/globals.scss'

import './_styles/formCustom.scss'
// 導入
// import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { ToastProvider } from '@/app/_components/ToastManager'
import { Inter } from 'next/font/google'
// import ClientCanvas from './_components/home/ClientCanvas'

// import { AuthProvider } from './_components/Auth/AuthProvider'
// import { AuthProvider } from '@/app/_components/Auth/AuthProvider'
import GoToTopButton from './_components/GoToTopButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '國立故瓷博物館',
  description: '國立故瓷博物館官方網站',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        

          {/* <AuthProvider> */}
          <ToastProvider>
            {/* <Navbar /> */}
            {/* <div style={{ border: '2px solid green', height: '100%' }}> */}
            {children}
            {/* </div> */}
            {/* <Footer /> */}
          </ToastProvider>
          {/* </AuthProvider> */}
        <GoToTopButton />
      </body>
    </html>
  )
}
