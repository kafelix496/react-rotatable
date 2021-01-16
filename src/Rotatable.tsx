import React from 'react'

import RotatableCore from './RotatableCore'

import type { RotatableProps } from './interfaces'

import { setStyle } from '@kafelix496/dom'

import './Rotatable.css'

const Rotatable: React.FC<RotatableProps> = (props): JSX.Element => {
  // console.log('Rotatable', props)

  const { children, disabled = false } = props

  const targetRef = React.useRef<HTMLElement>(null)
  const handleRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (disabled && handleRef.current !== null) {
      setStyle({ cursor: 'not-allowed' }, handleRef.current)
    }
  }, [disabled])

  return (
    <RotatableCore {...props} targetRef={targetRef} handleRef={handleRef}>
      {React.cloneElement(React.Children.only(children), {
        className: (
          ((children?.props?.className ?? '') as string) + ' react-rotatable'
        ).trimLeft(),
        ref: targetRef,
        children: (
          <>
            {children?.props?.children ?? ''}

            <div className="react-rotatable-handle" ref={handleRef as any} />
          </>
        )
      })}
    </RotatableCore>
  )
}

export default Rotatable
