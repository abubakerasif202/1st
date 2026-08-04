type Props = { eyebrow: string; title: string; intro?: string; align?: 'left' | 'center'; dark?: boolean }
export function SectionHeading({ eyebrow, title, intro, align = 'left', dark = false }: Props) {
  return <div className={`section-heading ${align === 'center' ? 'text-center mx-auto' : ''}`}>
    <p className="eyebrow">{eyebrow}</p>
    <h2 className={dark ? 'text-brand-black' : ''}>{title}</h2>
    {intro && <p className={dark ? 'text-slate-600' : 'text-stone-300'}>{intro}</p>}
  </div>
}
