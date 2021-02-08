interface Coordinate {
  x: number
  y: number
}
type Degree = number

interface InitialData {
  mouseCoordinate: Coordinate
  mouseDegree: Degree
  targetNodeCenterCoordinate: Coordinate
  targetNodeDegree: Degree
  targetNodeTransformMatrix: number[][]
}

interface Ui {
  targetNode: HTMLElement | null
  startDegree: Degree
  currentDegree: Degree
}

interface RotatableProps {
  readonly children: JSX.Element
  readonly disabled?: boolean
  readonly rotatingClassName?: string
  readonly step?: number
  readonly rotateStart?: (event: MouseEvent, ui: Ui) => void
  readonly rotating?: (event: MouseEvent, ui: Ui) => void
  readonly rotateStop?: (event: MouseEvent, ui: Ui) => void
}

export type { Coordinate, Degree, InitialData, Ui, RotatableProps }
