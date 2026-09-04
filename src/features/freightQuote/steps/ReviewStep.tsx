import { Link } from 'react-router-dom'
import { useFormContext, useWatch } from 'react-hook-form'
import { summariseTotals } from '../calculations.js'
import { QuoteSummary } from '../QuoteSummary.js'
import type { QuoteFormValues } from '../schema.js'

interface ReviewStepProps {
  onEdit: (stepIndex: number) => void
}

export function ReviewStep({ onEdit }: ReviewStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuoteFormValues>()
  const data = useWatch({ control }) as QuoteFormValues
  const totals = summariseTotals(data.items ?? [])

  return (
    <div className="fq-review">
      <QuoteSummary data={data} totals={totals} onEdit={onEdit} />

      <div className={`fq-terms${errors.termsAccepted ? ' fq-terms--invalid' : ''}`}>
        <label htmlFor="termsAccepted" className="fq-check">
          <input id="termsAccepted" type="checkbox" className="fq-check__box" {...register('termsAccepted')} />
          <span>
            I have read and agree to the{' '}
            <Link to="/freight-terms" target="_blank" rel="noopener noreferrer">
              Freight Terms &amp; Conditions
            </Link>
            .
          </span>
        </label>
        {errors.termsAccepted && (
          <small className="fq-field__error" role="alert">
            {errors.termsAccepted.message as string}
          </small>
        )}
      </div>
    </div>
  )
}
