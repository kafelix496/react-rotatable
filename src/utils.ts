import { subtract, prop, converge, __, multiply, compose, add, modulo, flip } from 'ramda'

import type { Coordinate, Degree } from './interfaces'

const rad2degree = compose(
  flip(modulo)(360),
  flip(add)(360),
  flip(multiply)(180 / Math.PI)
)
const getDegreeOfTwoPoint = (
  centerCoordinate: Coordinate,
  targetCoordinate: Coordinate
): Degree => {
  const distanceFromTwoPoint = converge(subtract, [
    prop(__, targetCoordinate),
    prop(__, centerCoordinate)
  ])

  return rad2degree(Math.atan2(distanceFromTwoPoint('y'), distanceFromTwoPoint('x')))
}

export { getDegreeOfTwoPoint }
