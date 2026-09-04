import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { lineVolumeM3, summariseTotals } from '../calculations'
import { emptyFreightItem, MAX_FREIGHT_ITEMS, type QuoteFormValues } from '../schema'
import type { FreightItemInput } from '../types'
import { FreightItemCard } from './FreightItemCard'

/** A watched row is only counted once every numeric field is a positive finite number. */
function isComplete(item: Partial<FreightItemInput>): item is FreightItemInput {
  return (
    ['quantity', 'lengthCm', 'widthCm', 'heightCm', 'weightEachKg'] as const
  ).every((key) => Number.isFinite(item[key]) && (item[key] as number) > 0)
}

export function FreightItemsStep() {
  const { control } = useFormContext<QuoteFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = (useWatch({ control, name: 'items' }) ?? []) as Partial<FreightItemInput>[]

  const completeItems = watchedItems.filter(isComplete)
  const totals = summariseTotals(completeItems)

  return (
    <div className="fq-items">
      <ol className="fq-items__list">
        {fields.map((field, index) => {
          const watched = watchedItems[index]
          return (
            <li key={field.id}>
              <FreightItemCard
                index={index}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
                lineVolumeM3={watched && isComplete(watched) ? lineVolumeM3(watched) : null}
              />
            </li>
          )
        })}
      </ol>

      <button
        type="button"
        className="fq-btn fq-btn--outline"
        onClick={() => append(emptyFreightItem())}
        disabled={fields.length >= MAX_FREIGHT_ITEMS}
      >
        + Add item
      </button>

      <dl className="fq-items__totals" aria-live="polite">
        <div>
          <dt>Total items</dt>
          <dd>{totals.totalItems}</dd>
        </div>
        <div>
          <dt>Total weight</dt>
          <dd>{totals.totalWeightKg} kg</dd>
        </div>
        <div>
          <dt>Total volume</dt>
          <dd>{totals.totalVolumeM3} m³</dd>
        </div>
      </dl>
      <p className="fq-items__note">
        These totals are a live estimate. 1st Class Express confirms the chargeable
        figures when the quote is prepared.
      </p>
    </div>
  )
}
