import React from 'react'

import RotatableCore from './RotatableCore'
import type { RotatableProps } from './interfaces'

import RotatableHandle from './RotatableHandle'

const Rotatable: React.FC<RotatableProps> = (props): JSX.Element => {
  // console.log('Rotatable', props)

  const { children } = props

  const targetRef = React.useRef<HTMLElement>(null)
  const handleRef = React.useRef<HTMLDivElement>(null)

  const childrenClassName = (children.props.className ?? '') as string

  return (
    <RotatableCore {...props} targetRef={targetRef} handleRef={handleRef}>
      {React.cloneElement(React.Children.only(children), {
        className: (childrenClassName + ' react-rotatable').trim(),
        ref: targetRef,
        children: (
          <>
            {children?.props?.children ?? ''}

            {<RotatableHandle handleRef={handleRef} />}
          </>
        )
      })}
    </RotatableCore>
  )
}

export default Rotatable
