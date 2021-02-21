import React from 'react'

import './Rotatable.css'

interface RotatableHandleProps {
  handleRef: React.MutableRefObject<HTMLDivElement | null>
}

const RotatableHandle: React.FC<RotatableHandleProps> = (props): JSX.Element => {
  const { handleRef } = props

  return <div className="react-rotatable-handle" ref={handleRef} />
}

export default RotatableHandle
