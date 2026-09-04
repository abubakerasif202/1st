import { CheckboxField, NumberField, SelectField, TextField } from '../fields'
import { FREIGHT_ITEM_TYPE_OPTIONS } from '../options'

interface FreightItemCardProps {
  index: number
  onRemove: () => void
  canRemove: boolean
  lineVolumeM3: number | null
}

export function FreightItemCard({ index, onRemove, canRemove, lineVolumeM3 }: FreightItemCardProps) {
  const prefix = `items.${index}` as const
  return (
    <fieldset className="fq-item-card">
      <legend className="fq-item-card__legend">Item {index + 1}</legend>

      <div className="fq-item-card__grid">
        <SelectField
          name={`${prefix}.itemType`}
          label="Type"
          required
          options={FREIGHT_ITEM_TYPE_OPTIONS}
        />
        <NumberField name={`${prefix}.quantity`} label="Quantity" required min={1} step={1} />
        <NumberField name={`${prefix}.weightEachKg`} label="Weight each" required min={0} unit="kg" />

        <NumberField name={`${prefix}.lengthCm`} label="Length" required min={0} unit="cm" />
        <NumberField name={`${prefix}.widthCm`} label="Width" required min={0} unit="cm" />
        <NumberField name={`${prefix}.heightCm`} label="Height" required min={0} unit="cm" />

        <TextField
          name={`${prefix}.description`}
          label="Description"
          className="fq-span-3"
          placeholder="Contents, packaging, anything the driver should know"
        />
      </div>

      <div className="fq-item-card__foot">
        <div className="fq-item-card__checks">
          <CheckboxField name={`${prefix}.stackable`} label="Stackable" />
          <CheckboxField name={`${prefix}.dangerousGoods`} label="Dangerous goods" />
        </div>
        <p className="fq-item-card__volume">
          Line volume:{' '}
          <strong>{lineVolumeM3 === null ? '—' : `${lineVolumeM3} m³`}</strong>
        </p>
        <button
          type="button"
          className="fq-btn fq-btn--ghost fq-btn--danger"
          onClick={onRemove}
          disabled={!canRemove}
        >
          Remove item
        </button>
      </div>
    </fieldset>
  )
}
