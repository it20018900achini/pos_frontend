import { Loader2 } from 'lucide-react'
import React from 'react'

const PageNotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center p-8 text-center">
              <h1 className="font-bold text-5xl"><Loader2 className=' animate-spin'/></h1>
            </div>
  )
}

export default PageNotFound