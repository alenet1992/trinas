'use client'

import React from 'react'
import { TailSpin } from 'react-loader-spinner'

export default function Loading() {
    return (
        <div className='w-full  flex-col min-h-full h-screen flex items-center justify-center '>
            <TailSpin
                height="50"
                width="50"
                color="#373a4e"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <p className='text-sm mt-2 font-semibold text-[#373a4e]'>Loading...</p>
        </div>
    )
}
