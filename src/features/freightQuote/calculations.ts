// Authoritative freight maths. Runs on the server for the stored record and in
// the browser only to preview the same numbers. Dimensions arrive in
// centimetres; volume is reported in cubic metres.
//
// Per the spec: line volume = (L/100) * (W/100) * (H/100) * quantity.

import type { FreightItemInput, QuoteTotals, QuoteTotalsWithLines } from './types.js'

const CM_PER_M = 100
const VOLUME_DECIMALS = 4
const WEIGHT_DECIMALS = 2

/** Round to a fixed number of decimals without floating-point drift. */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/** Cubic metres for a whole line (per-unit volume times quantity). */
export function lineVolumeM3(item: Readonly<FreightItemInput>): number {
  const perUnit =
    (item.lengthCm / CM_PER_M) * (item.widthCm / CM_PER_M) * (item.heightCm / CM_PER_M)
  return roundTo(perUnit * item.quantity, VOLUME_DECIMALS)
}

/** Kilograms for a whole line. */
export function lineWeightKg(item: Readonly<FreightItemInput>): number {
  return roundTo(item.weightEachKg * item.quantity, WEIGHT_DECIMALS)
}

/** Aggregate totals across every line of the manifest. */
export function quoteTotals(items: ReadonlyArray<FreightItemInput>): QuoteTotalsWithLines {
  const lineVolumesM3 = items.map(lineVolumeM3)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalWeightKg = roundTo(
    items.reduce((sum, item) => sum + lineWeightKg(item), 0),
    WEIGHT_DECIMALS,
  )
  const totalVolumeM3 = roundTo(
    lineVolumesM3.reduce((sum, volume) => sum + volume, 0),
    VOLUME_DECIMALS,
  )
  return { totalItems, totalWeightKg, totalVolumeM3, lineVolumesM3 }
}

/** Narrowed totals without the per-line breakdown, for storage and display. */
export function summariseTotals(items: ReadonlyArray<FreightItemInput>): QuoteTotals {
  const { totalItems, totalWeightKg, totalVolumeM3 } = quoteTotals(items)
  return { totalItems, totalWeightKg, totalVolumeM3 }
}
