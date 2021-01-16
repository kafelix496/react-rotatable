import { subtract, prop, converge, __, multiply, compose, add, modulo } from 'ramda'

import type { Coordinate, Degree } from './interfaces'

const rad2degree = compose(modulo(__, 360), add(__, 360), multiply(__, 180 / Math.PI))
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

export {
  // eslint-disable-next-line import/prefer-default-export
  getDegreeOfTwoPoint
}
