import { describe, expect, test } from 'vitest'
import {
  canTransition,
  isTerminal,
  nextStatuses,
  QUOTE_STATUS_LABELS,
} from '../features/freightQuote/statusFlow'
import { QUOTE_STATUSES } from '../features/freightQuote/types'

describe('statusFlow', () => {
  test('every status has a label', () => {
    for (const status of QUOTE_STATUSES) {
      expect(QUOTE_STATUS_LABELS[status]).toBeTruthy()
    }
  })

  test('follows the intended lifecycle forward', () => {
    expect(canTransition('new', 'reviewing')).toBe(true)
    expect(canTransition('reviewing', 'quoted')).toBe(true)
    expect(canTransition('quoted', 'accepted')).toBe(true)
    expect(canTransition('accepted', 'booked')).toBe(true)
    expect(canTransition('booked', 'in_transit')).toBe(true)
    expect(canTransition('in_transit', 'delivered')).toBe(true)
  })

  test('rejects skipping the lifecycle', () => {
    expect(canTransition('new', 'delivered')).toBe(false)
    expect(canTransition('new', 'booked')).toBe(false)
  })

  test('a no-op transition is allowed', () => {
    expect(canTransition('quoted', 'quoted')).toBe(true)
  })

  test('delivered and cancelled are terminal', () => {
    expect(isTerminal('delivered')).toBe(true)
    expect(isTerminal('cancelled')).toBe(true)
    expect(nextStatuses('delivered')).toHaveLength(0)
  })

  test('on_hold can resume into active states', () => {
    expect(canTransition('on_hold', 'reviewing')).toBe(true)
    expect(canTransition('on_hold', 'in_transit')).toBe(true)
  })
})
