import React from 'react'

const Title = ({ h1, p }) => {
  return (
    <div className="flex flex-col gap-1">
        <h1 className='text-3xl font-bold'>{h1}</h1>
        <p>{p}</p>
    </div>
  )
}

export default Title