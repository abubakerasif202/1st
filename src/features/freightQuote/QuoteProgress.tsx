import { WIZARD_STEPS } from './wizardSteps.js'

interface QuoteProgressProps {
  current: number
  furthestReached: number
  onJump: (stepIndex: number) => void
}

export function QuoteProgress({ current, furthestReached, onJump }: QuoteProgressProps) {
  return (
    <nav aria-label="Quote progress" className="fq-progress">
      <ol className="fq-progress__list">
        {WIZARD_STEPS.map((step, index) => {
          const state =
            index < current ? 'done' : index === current ? 'current' : 'upcoming'
          const reachable = index <= furthestReached
          return (
            <li
              key={step.id}
              className={`fq-progress__step fq-progress__step--${state}`}
              aria-current={index === current ? 'step' : undefined}
            >
              <button
                type="button"
                className="fq-progress__btn"
                onClick={() => reachable && onJump(index)}
                disabled={!reachable}
                aria-label={`Step ${index + 1}: ${step.label}`}
              >
                <span className="fq-progress__marker" aria-hidden="true">
                  {index < current ? '✓' : index + 1}
                </span>
                <span className="fq-progress__label">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="fq-progress__count" aria-hidden="true">
        Step {current + 1} of {WIZARD_STEPS.length}
      </p>
    </nav>
  )
}
