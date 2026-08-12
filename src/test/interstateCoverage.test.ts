import { describe, expect, it } from 'vitest'
import { interstateCoverage, interstateRoutes } from '../data/interstateRoutes'

describe('interstate coverage claims', () => {
  it('only publishes destinations supported by the company route data', () => {
    expect(interstateCoverage.map(({ name }) => name)).toEqual([
      'Canberra', 'Melbourne', 'Adelaide', 'Brisbane', 'Perth',
    ])
    expect(interstateCoverage.map(({ name }) => name)).not.toEqual(expect.arrayContaining(['Darwin', 'Hobart']))
  })

  it('keeps dedicated corridor pages within the published coverage', () => {
    const destinationCities = new Set<string>(interstateCoverage.map(({ name }) => name))
    expect(interstateRoutes.every(({ destination }) => destinationCities.has(destination.split(',')[0]))).toBe(true)
  })
})
