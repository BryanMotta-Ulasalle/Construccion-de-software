import React from 'react'

const StatsCard = ({ data, color = "gray", title }) => {
    const colorVariants = {
        "gray": "bg-chart-4",
        "blue": "bg-sidebar-primary",
    }    
  return (
    <div className={`w-60 h-35 rounded-xl flex flex-col gap-2 p-8 justify-center ${colorVariants[color]}`}>
        <h1 className='text-[#c5c4c8]'>{title}</h1>
        <span className="text-[#f0f1f2] font-bold text-5xl">{data}</span>
    </div>
  )
}

export default StatsCard