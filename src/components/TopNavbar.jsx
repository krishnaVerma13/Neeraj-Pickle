import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function TopNavbar({ onToggleSidebar, title = 'Dashboard', onOpenProfile }) {
    const navigate = useNavigate()
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm ">
            <div className="flex items-center gap-3">
                <button aria-label="Toggle sidebar" onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" /></svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </div>


            <div className="flex items-center gap-3">
                
                {/* <button aria-label="Profile" onClick={onOpenProfile} className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">NT</span>
                </button> */}
                <div>
                    <button 
                    className='bg-lime-200 px-3 py-1 rounded-lg font-semibold'
                    onClick={()=>navigate('/')}>{`GO to website`}</button>
                </div>
            </div>
        </header>
    )
}