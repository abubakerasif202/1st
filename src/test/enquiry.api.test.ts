import { beforeAll, describe, expect, test } from 'vitest'
import enquiryHandler from '../../api/enquiry'
import careersHandler from '../../api/careers'

// The handlers need a from/to address configured; Resend itself is stubbed out
// by the VITEST guard in the mailer, so nothing is actually sent.
beforeAll(() => {
  process.env.QUOTE_FROM_EMAIL = 'quotes@example.test'
  process.env.QUOTE_INTERNAL_EMAIL = 'ops@example.test'
})

function mockRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code
      return res
    },
    setHeader() {
      return res
    },
    send(payload: unknown) {
      res.body = typeof payload === 'string' ? JSON.parse(payload) : payload
      return res
    },
  }
  return res
}

async function mkCall(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: any,
  body: unknown,
  method = 'POST',
): Promise<ReturnType<typeof mockRes>> {
  const res = mockRes()
  await handler({ method, body, headers: { 'x-real-ip': String(Math.random()) }, socket: {} }, res)
  return res
}

const validQuickQuote = {
  kind: 'quick-quote',
  name: 'Alex Kim',
  email: 'alex@example.com',
  phone: '0400 000 000',
  pickup: 'Sydney NSW',
  delivery: 'Melbourne VIC',
  freight: 'Two pallets of packaged goods, forklift both ends.',
  consent: true,
  website: '',
}

const validContact = {
  kind: 'contact',
  name: 'Alex Kim',
  email: 'alex@example.com',
  phone: '0400 000 000',
  message: 'I would like to discuss a regular Sydney-Brisbane run.',
  website: '',
}

const tinyPdfBase64 = Buffer.from('%PDF-1.4 test resume').toString('base64')
const validCareers = {
  firstName: 'Alex',
  lastName: 'Kim',
  email: 'alex@example.com',
  phone: '0400000000',
  suburb: 'Parramatta',
  role: 'HC Driver',
  availability: 'Immediate',
  operatingArea: 'Both local and interstate',
  licenceClass: 'HC',
  yearsExperience: '3–5 years',
  vehicleTypes: 'rigid trucks, semi-trailers',
  rightToWork: 'Yes',
  privacyAcknowledgement: true,
  website: '',
  resume: { filename: 'alex-kim-cv.pdf', contentType: 'application/pdf', content: tinyPdfBase64 },
}

describe('POST /api/enquiry', () => {
  test('accepts a valid quick quote', async () => {
    const res = await mkCall(enquiryHandler, validQuickQuote)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ ok: true })
  })

  test('accepts a valid contact enquiry', async () => {
    const res = await mkCall(enquiryHandler, validContact)
    expect(res.statusCode).toBe(200)
  })

  test('rejects a missing kind / bad shape', async () => {
    const res = await mkCall(enquiryHandler, { name: 'x' })
    expect(res.statusCode).toBe(400)
  })

  test('rejects a filled honeypot', async () => {
    const res = await mkCall(enquiryHandler, { ...validContact, website: 'http://spam' })
    expect(res.statusCode).toBe(400)
  })

  test('rejects a short freight description', async () => {
    const res = await mkCall(enquiryHandler, { ...validQuickQuote, freight: 'boxes' })
    expect(res.statusCode).toBe(400)
    expect(JSON.stringify(res.body)).toContain('Describe the freight')
  })

  test('rejects non-POST', async () => {
    const res = await mkCall(enquiryHandler, undefined, 'GET')
    expect(res.statusCode).toBe(405)
  })
})

describe('POST /api/careers', () => {
  test('accepts a valid application with a résumé', async () => {
    const res = await mkCall(careersHandler, validCareers)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ ok: true })
  })

  test('rejects a non-PDF/DOC résumé', async () => {
    const res = await mkCall(careersHandler, {
      ...validCareers,
      resume: { ...validCareers.resume, contentType: 'image/png' },
    })
    expect(res.statusCode).toBe(400)
  })

  test('rejects a filled honeypot', async () => {
    const res = await mkCall(careersHandler, { ...validCareers, website: 'x' })
    expect(res.statusCode).toBe(400)
  })

  test('rejects a bad phone number', async () => {
    const res = await mkCall(careersHandler, { ...validCareers, phone: '123' })
    expect(res.statusCode).toBe(400)
  })
})

