import React from 'react'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import { getElementRotateZ, setStyle } from '@kafelix496/dom'

import Rotatable from '../Rotatable'
import type { Ui } from '../interfaces'

describe('Test Rotatable component', () => {
  test('should pass style and className properly from child', () => {
    const { getByTestId } = render(
      <Rotatable>
        <div
          data-testid="test-div"
          className="hello"
          style={{ backgroundColor: 'green' }}
        />
      </Rotatable>
    )

    const testDiv = getByTestId('test-div')

    expect(testDiv).toHaveStyle({ backgroundColor: 'green' })
    expect(testDiv).toHaveClass('react-rotatable hello')
  })

  test('should set the appropriate custom className when dragging', () => {
    const { getByTestId } = render(
      <Rotatable rotatingClassName="rotating">
        <div data-testid="test-div" />
      </Rotatable>
    )

    const testDiv = getByTestId('test-div')
    const rotateHandleElement = testDiv.querySelector(
      '.react-rotatable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(rotateHandleElement)
    expect(testDiv).toHaveClass('react-rotatable rotating')
    fireEvent.mouseUp(rotateHandleElement)
    expect(testDiv).toHaveClass('react-rotatable')
    expect(testDiv).not.toHaveClass('rotating')
  })

  test("should not activate rotate if 'disable' prop is true", () => {
    const { getByTestId } = render(
      <Rotatable rotatingClassName="rotating" disabled={true}>
        <div data-testid="test-div" />
      </Rotatable>
    )

    const testDiv = getByTestId('test-div')
    const rotateHandleElement = testDiv.querySelector(
      '.react-rotatable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(rotateHandleElement)
    expect(testDiv).toHaveClass('react-rotatable')
    fireEvent.mouseUp(rotateHandleElement)
    expect(testDiv).toHaveClass('react-rotatable')
    expect(testDiv).not.toHaveClass('rotating')
  })

  test('should trigger callback functions', () => {
    const rotateStart = jest.fn()
    const rotating = jest.fn()
    const rotateStop = jest.fn()

    const { getByTestId } = render(
      <Rotatable rotateStart={rotateStart} rotating={rotating} rotateStop={rotateStop}>
        <div data-testid="test-div" />
      </Rotatable>
    )

    const testDiv = getByTestId('test-div')
    const rotateHandleElement = testDiv.querySelector(
      '.react-rotatable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(rotateHandleElement)
    expect(rotateStart).toHaveBeenCalled()
    expect(rotating).not.toHaveBeenCalled()
    expect(rotateStop).not.toHaveBeenCalled()
    fireEvent.mouseUp(rotateHandleElement)
    expect(rotating).not.toHaveBeenCalled()
    expect(rotateStop).toHaveBeenCalled()
  })

  describe('should rotate content block', () => {
    test('should callback param is the same what I expect', () => {
      let eventValue: MouseEvent | null = null
      let uiValue: Ui | null = null

      const rotateStart = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })
      const rotating = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })
      const rotateStop = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })

      const { getByTestId } = render(
        <Rotatable rotateStart={rotateStart} rotating={rotating} rotateStop={rotateStop}>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
            }}
          />
        </Rotatable>
      )

      const testDiv = getByTestId('test-div')
      const rotateHandleElement = testDiv.querySelector(
        '.react-rotatable-handle'
      ) as HTMLElement

      fireEvent.mouseDown(rotateHandleElement, { clientX: 50, clientY: 110 })
      expect(uiValue).toEqual({
        targetNode: testDiv,
        startDegree: 0,
        currentDegree: 0
      })
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mousedown').type
      )
      eventValue = null
      uiValue = null

      fireEvent.mouseMove(rotateHandleElement, { clientX: 0, clientY: 50 })
      expect(uiValue!.targetNode).toBe(testDiv)
      expect(uiValue!.startDegree).toBe(0)
      expect(uiValue!.currentDegree).toBeCloseTo(61.4, 1)
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mousemove').type
      )
      eventValue = null
      uiValue = null

      fireEvent.mouseUp(rotateHandleElement, { clientX: 0, clientY: 50 })
      expect(uiValue!.targetNode).toBe(testDiv)
      expect(uiValue!.startDegree).toBe(0)
      expect(uiValue!.currentDegree).toBeCloseTo(61.4, 1)
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mouseup').type
      )
      eventValue = null
      uiValue = null
    })

    test('rotate without pressing shiftKey', () => {
      const { getByTestId } = render(
        <Rotatable>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
            }}
          />
        </Rotatable>
      )

      const testDiv = getByTestId('test-div')
      const rotateHandleElement = testDiv.querySelector(
        '.react-rotatable-handle'
      ) as HTMLElement

      setStyle({ position: 'absolute', left: '50px', top: '110px' }, rotateHandleElement)
      expect(rotateHandleElement).toHaveStyle({
        position: 'absolute',
        left: '50px',
        top: '110px'
      })

      fireEvent.mouseDown(rotateHandleElement, { clientX: 50, clientY: 110 })
      expect(getElementRotateZ(testDiv)).toBe(0)

      fireEvent.mouseMove(rotateHandleElement, { clientX: 0, clientY: 50 })
      expect(getElementRotateZ(testDiv)).toBeCloseTo(61.4, 1)

      fireEvent.mouseUp(rotateHandleElement)
      expect(getElementRotateZ(testDiv)).toBeCloseTo(61.4, 1)
    })

    test('rotate with pressing shiftKey ( with default step 5 )', () => {
      const { getByTestId } = render(
        <Rotatable>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
            }}
          />
        </Rotatable>
      )

      const testDiv = getByTestId('test-div')
      const rotateHandleElement = testDiv.querySelector(
        '.react-rotatable-handle'
      ) as HTMLElement

      setStyle({ position: 'absolute', left: '50px', top: '110px' }, rotateHandleElement)
      expect(rotateHandleElement).toHaveStyle({
        position: 'absolute',
        left: '50px',
        top: '110px'
      })

      fireEvent.mouseDown(rotateHandleElement, { clientX: 50, clientY: 110 })
      expect(getElementRotateZ(testDiv)).toBe(0)

      fireEvent.mouseMove(rotateHandleElement, {
        clientX: 0,
        clientY: 47,
        shiftKey: true
      })
      expect(getElementRotateZ(testDiv)).toBeCloseTo(65, 2)

      fireEvent.mouseMove(rotateHandleElement, {
        clientX: 0,
        clientY: 50,
        shiftKey: true
      })
      expect(getElementRotateZ(testDiv)).toBeCloseTo(60, 2)

      fireEvent.mouseUp(rotateHandleElement)
      expect(getElementRotateZ(testDiv)).toBeCloseTo(60, 1)
    })

    test('rotate with pressing shiftKey ( with step 7 )', () => {
      const { getByTestId } = render(
        <Rotatable step={7}>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
            }}
          />
        </Rotatable>
      )

      const testDiv = getByTestId('test-div')
      const rotateHandleElement = testDiv.querySelector(
        '.react-rotatable-handle'
      ) as HTMLElement

      setStyle({ position: 'absolute', left: '50px', top: '110px' }, rotateHandleElement)
      expect(rotateHandleElement).toHaveStyle({
        position: 'absolute',
        left: '50px',
        top: '110px'
      })

      fireEvent.mouseDown(rotateHandleElement, { clientX: 50, clientY: 110 })
      expect(getElementRotateZ(testDiv)).toBe(0)

      fireEvent.mouseMove(rotateHandleElement, {
        clientX: 0,
        clientY: 47,
        shiftKey: true
      })
      expect(getElementRotateZ(testDiv)).toBeCloseTo(63, 2)

      fireEvent.mouseMove(rotateHandleElement, {
        clientX: 0,
        clientY: 50,
        shiftKey: true
      })
      expect(getElementRotateZ(testDiv)).toBeCloseTo(56, 2)

      fireEvent.mouseUp(rotateHandleElement)
      expect(getElementRotateZ(testDiv)).toBeCloseTo(56, 1)
    })
  })

  test('if style left or top value is not specified, use offsetWidth, offsetHeight', () => {
    const { getByTestId } = render(
      <Rotatable>
        <div
          data-testid="test-div"
          style={{ position: 'absolute', width: 50, height: 50 }}
        />
      </Rotatable>
    )

    const testDiv = getByTestId('test-div')
    const rotateHandleElement = testDiv.querySelector(
      '.react-rotatable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(rotateHandleElement, { clientX: 50, clientY: 110 })
    expect(getElementRotateZ(testDiv)).toBe(0)

    fireEvent.mouseMove(rotateHandleElement, { clientX: 0, clientY: 50 })
    expect(getElementRotateZ(testDiv)).toBeCloseTo(61.4, 1)

    fireEvent.mouseUp(rotateHandleElement)
    expect(getElementRotateZ(testDiv)).toBeCloseTo(61.4, 1)
  })
})
