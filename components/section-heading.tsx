type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  id?: string
}

// Left-aligned section heading with a small eyebrow label, shared by the homepage sections
export function SectionHeading({ eyebrow, title, description, id }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-700 dark:text-accent">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-heading font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-gray-600 dark:text-gray-400 md:text-lg">{description}</p>}
    </div>
  )
}
