import { describe, expect, test } from 'vitest'
import { buildCsv, csvCell, csvRow } from '../features/freightQuote/csv'

describe('csvCell', () => {
  test('quotes values containing a comma, quote or newline', () => {
    expect(csvCell('Smith, John')).toBe('"Smith, John"')
    expect(csvCell('he said "hi"')).toBe('"he said ""hi"""')
    expect(csvCell('line1\nline2')).toBe('"line1\nline2"')
  })

  test('neutralises spreadsheet formula injection', () => {
    expect(csvCell('=1+1')).toBe("'=1+1")
    expect(csvCell('+61400000000')).toBe("'+61400000000")
    expect(csvCell('-2')).toBe("'-2")
    expect(csvCell('@handle')).toBe("'@handle")
  })

  test('renders booleans and blanks', () => {
    expect(csvCell(true)).toBe('Yes')
    expect(csvCell(false)).toBe('No')
    expect(csvCell(null)).toBe('')
    expect(csvCell(undefined)).toBe('')
  })
})

describe('buildCsv', () => {
  test('emits a BOM, CRLF rows and a trailing newline', () => {
    const csv = buildCsv(['A', 'B'], [['1', '2']])
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv).toContain('A,B\r\n1,2\r\n')
  })

  test('escapes header and body cells consistently', () => {
    const csv = buildCsv(['Name'], [['Doe, Jane']])
    expect(csvRow(['Doe, Jane'])).toBe('"Doe, Jane"')
    expect(csv).toContain('"Doe, Jane"')
  })
})
