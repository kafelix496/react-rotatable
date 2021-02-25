import React from 'react'

import { compose } from 'ramda'
import { addClass, addEvent, removeClass, removeEvent } from '@kafelix496/dom'
import {
  stringToArray,
  arrayToString,
  generateRotateZMatrix,
  multiply,
  getRotateZ
} from '@kafelix496/matrix'
import { useRefWithSetter } from '@kafelix496/react-hooks'

import type { InitialData, Ui, RotatableProps, Coordinate } from './interfaces'

import { getDegreeOfTwoPoint } from './utils'

interface RotatableCoreProps extends RotatableProps {
  handleRef: React.MutableRefObject<HTMLElement | null>
  targetRef: React.MutableRefObject<HTMLElement | null>
}

const RotatableCore: React.FC<RotatableCoreProps> = (props): JSX.Element => {
  // console.log('RotatableCore', props)

  const {
    children,
    disabled = false,
    rotatingClassName = '',
    step = 5,
    targetRef,
    handleRef,
    rotateStart,
    rotating,
    rotateStop
  } = props

  const [initialDataRef, setInitialData] = useRefWithSetter<InitialData>({
    mouseCoordinate: { x: NaN, y: NaN },
    mouseDegree: NaN,
    targetNodeCenterCoordinate: { x: NaN, y: NaN },
    targetNodeDegree: NaN,
    targetNodeTransformMatrix: [[]]
  })
  const [uiData, setUiData] = useRefWithSetter<Ui>({
    targetNode: null,
    startDegree: NaN,
    currentDegree: NaN
  })
  const [
    currentMouseCoordinateRef,
    setCurrentMouseCoordinate
  ] = useRefWithSetter<Coordinate>({
    x: NaN,
    y: NaN
  })

  const [isMouseDown, setMouseDownStatus] = React.useState<boolean>(false)

  React.useEffect(() => {
    setUiData((prev) => ({
      ...prev,
      targetNode: targetRef.current
    }))
  }, [targetRef, setUiData])

  React.useEffect(() => {
    const mouseDownHandle = (event: MouseEvent): void => {
      if (disabled) {
        return
      }

      const targetElement = targetRef.current

      if (targetElement === null) {
        return
      }

      setInitialData((prev) => {
        const targetNodeComputedStyle = window.getComputedStyle(targetElement)
        const targetNodeTransformMatrix = stringToArray(targetNodeComputedStyle.transform)

        return {
          ...prev,
          mouseCoordinate: {
            x: event.clientX,
            y: event.clientY
          },
          targetNodeCenterCoordinate: {
            x:
              (targetNodeComputedStyle.left !== ''
                ? parseFloat(targetNodeComputedStyle.left)
                : targetElement.offsetLeft) +
              parseFloat(targetNodeComputedStyle.width) * 0.5,
            y:
              (targetNodeComputedStyle.top !== ''
                ? parseFloat(targetNodeComputedStyle.top)
                : targetElement.offsetTop) +
              parseFloat(targetNodeComputedStyle.height) * 0.5
          },
          targetNodeDegree: getRotateZ(targetNodeTransformMatrix),
          targetNodeTransformMatrix
        }
      })

      setUiData((prev) => ({
        ...prev,
        startDegree: initialDataRef.current.targetNodeDegree,
        currentDegree: initialDataRef.current.targetNodeDegree
      }))

      if (rotatingClassName.length > 0) {
        addClass(rotatingClassName, targetElement)
      }

      if (typeof rotateStart === 'function') {
        rotateStart(event, uiData.current)
      }

      setMouseDownStatus(true)
    }

    const handleElement = handleRef.current

    if (handleElement !== null) {
      if (disabled) {
        removeEvent(handleElement, 'mousedown', mouseDownHandle as EventListener)
      } else {
        addEvent(handleElement, 'mousedown', mouseDownHandle as EventListener)
      }
    }

    return () => {
      if (handleElement !== null) {
        removeEvent(handleElement, 'mousedown', mouseDownHandle as EventListener)
      }
    }
  }, [
    handleRef,
    disabled,
    initialDataRef,
    rotateStart,
    rotatingClassName,
    setInitialData,
    setUiData,
    targetRef,
    uiData
  ])

  /**
   * if initial mouse coordinate || target node center coodinate is changed
   * calculate initial mouse degree and update value
   *
   * the reason it's calculated in here is it can be updated by user with rotateStart function callback
   */
  React.useEffect(() => {
    const { mouseCoordinate, targetNodeCenterCoordinate } = initialDataRef.current

    const isAnyNaNValue = [
      ...Object.values(mouseCoordinate),
      ...Object.values(targetNodeCenterCoordinate)
    ].some((value) => Number.isNaN(value))

    if (!isAnyNaNValue) {
      const startDegree = getDegreeOfTwoPoint(targetNodeCenterCoordinate, mouseCoordinate)

      setInitialData((prev) => ({
        ...prev,
        mouseDegree: startDegree
      }))
    }
  }, [initialDataRef, setInitialData])

  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent): void => {
      if (targetRef.current?.style !== undefined) {
        setCurrentMouseCoordinate({ x: event.clientX, y: event.clientY })

        const mouseDegree = getDegreeOfTwoPoint(
          initialDataRef.current.targetNodeCenterCoordinate,
          currentMouseCoordinateRef.current
        )

        const variation = (() => {
          const defaultVariation = mouseDegree - initialDataRef.current.mouseDegree

          if (event.shiftKey && step > 0 && step < 180) {
            const remainder =
              (defaultVariation + initialDataRef.current.targetNodeDegree) % step

            return defaultVariation - remainder
          }

          return defaultVariation
        })()

        const currentDegree =
          (variation + initialDataRef.current.targetNodeDegree + 360) % 360

        setUiData((prev) => ({
          ...prev,
          currentDegree
        }))

        const newMatrixString = compose(
          arrayToString,
          multiply(initialDataRef.current.targetNodeTransformMatrix),
          generateRotateZMatrix
        )(variation)

        targetRef.current.style.transform = newMatrixString

        if (typeof rotating === 'function') {
          rotating(event, uiData.current)
        }
      }
    }
    const mouseUpHandler = (event: MouseEvent): void => {
      const targetElement = targetRef.current

      if (targetElement !== null && rotatingClassName.length > 0) {
        removeClass(rotatingClassName, targetElement)
      }

      if (typeof rotateStop === 'function') {
        rotateStop(event, uiData.current)
      }

      setInitialData({
        mouseCoordinate: { x: NaN, y: NaN },
        mouseDegree: NaN,
        targetNodeCenterCoordinate: { x: NaN, y: NaN },
        targetNodeDegree: NaN,
        targetNodeTransformMatrix: [[]]
      })

      setMouseDownStatus(false)
    }

    if (isMouseDown) {
      addEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      addEvent(document, 'mouseup', mouseUpHandler as EventListener)
    } else {
      removeEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      removeEvent(document, 'mouseup', mouseUpHandler as EventListener)
    }

    return () => {
      removeEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      removeEvent(document, 'mouseup', mouseUpHandler as EventListener)
    }
  }, [
    isMouseDown,
    currentMouseCoordinateRef,
    initialDataRef,
    rotateStop,
    rotating,
    rotatingClassName,
    setCurrentMouseCoordinate,
    setInitialData,
    setUiData,
    step,
    targetRef,
    uiData
  ])

  return React.cloneElement(React.Children.only(children))
}

export default RotatableCore
