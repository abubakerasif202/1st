// CSV formatting shared by the admin single-quote export and the filtered-list
// export. Pure string work — safe to import on the server or in the browser.
//
// Two hazards handled here:
//  * delimiter/quote/newline escaping (RFC 4180)
//  * spreadsheet formula injection — a leading = + - @ (or tab/CR) is neutralised
//    with a leading apostrophe so Excel / Sheets treat the cell as text.

export type CsvCell = string | number | boolean | null | undefined

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r']

function neutraliseFormula(text: string): string {
  return text.length > 0 && FORMULA_TRIGGERS.includes(text[0]) ? `'${text}` : text
}

export function csvCell(value: CsvCell): string {
  if (value === null || value === undefined) return ''
  const raw = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  const guarded = neutraliseFormula(raw)
  const needsQuoting = /[",\n\r]/.test(guarded)
  const escaped = guarded.replace(/"/g, '""')
  return needsQuoting ? `"${escaped}"` : escaped
}

export function csvRow(cells: ReadonlyArray<CsvCell>): string {
  return cells.map(csvCell).join(',')
}

// UTF-8 byte-order mark (U+FEFF): makes Excel open accented text without mojibake.
const UTF8_BOM = String.fromCodePoint(0xfeff)

export function buildCsv(headers: ReadonlyArray<string>, rows: ReadonlyArray<ReadonlyArray<CsvCell>>): string {
  // \r\n line endings + a UTF-8 BOM so Excel opens accented suburb names cleanly.
  const body = [csvRow(headers), ...rows.map(csvRow)].join('\r\n')
  return `${UTF8_BOM}${body}\r\n`
}
