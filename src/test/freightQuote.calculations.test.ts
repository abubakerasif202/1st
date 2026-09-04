import { describe, expect, test } from 'vitest'
import {
  lineVolumeM3,
  lineWeightKg,
  quoteTotals,
  roundTo,
  summariseTotals,
} from '../features/freightQuote/calculations'
import type { FreightItemInput } from '../features/freightQuote/types'

const item = (over: Partial<FreightItemInput> = {}): FreightItemInput => ({
  itemType: 'pallet',
  quantity: 1,
  lengthCm: 100,
  widthCm: 100,
  heightCm: 100,
  weightEachKg: 100,
  stackable: true,
  dangerousGoods: false,
  ...over,
})

describe('roundTo', () => {
  test('rounds to the requested precision', () => {
    expect(roundTo(1.23456, 4)).toBe(1.2346)
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3)
  })
})

describe('lineVolumeM3', () => {
  test('1m cube is 1 m3', () => {
    expect(lineVolumeM3(item())).toBe(1)
  })

  test('scales by quantity', () => {
    expect(lineVolumeM3(item({ quantity: 3 }))).toBe(3)
  })

  test('standard pallet 120x100x150cm x2', () => {
    // (1.2 * 1.0 * 1.5) * 2 = 3.6
    expect(lineVolumeM3(item({ lengthCm: 120, widthCm: 100, heightCm: 150, quantity: 2 }))).toBe(3.6)
  })
})

describe('lineWeightKg', () => {
  test('multiplies unit weight by quantity', () => {
    expect(lineWeightKg(item({ weightEachKg: 12.5, quantity: 4 }))).toBe(50)
  })
})

describe('quoteTotals', () => {
  test('aggregates items, weight and volume across lines', () => {
    const totals = quoteTotals([
      item({ quantity: 2, weightEachKg: 100 }),
      item({ lengthCm: 50, widthCm: 50, heightCm: 50, quantity: 1, weightEachKg: 20 }),
    ])
    expect(totals.totalItems).toBe(3)
    expect(totals.totalWeightKg).toBe(220)
    expect(totals.totalVolumeM3).toBe(roundTo(2 + 0.125, 4))
    expect(totals.lineVolumesM3).toEqual([2, 0.125])
  })

  test('empty manifest is all zeros', () => {
    expect(summariseTotals([])).toEqual({ totalItems: 0, totalWeightKg: 0, totalVolumeM3: 0 })
  })
})
