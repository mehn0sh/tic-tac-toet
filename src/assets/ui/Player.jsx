import React from 'react'

const Player = ({src}) => {
  return (
    <img
    src={src}
    className="absolute top-0 left-0 p-1.5 w-full h-full object-contain"
  />
  )
}

export default Player