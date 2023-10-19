import Image from 'next/image'
import { Inter } from 'next/font/google'
import CoLevel from '@/components/CoLevel'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-center text-2xl font-bold"><span className='text-blue-400'>InHale</span><span className='text-green-400'>Safe</span></h2>
        <CoLevel />
      </div>
    </>
  )
}
