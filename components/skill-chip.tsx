import Image from "next/image"

type SkillChipProps = {
  src: string
  name: string
}

export function SkillChip({ src, name }: SkillChipProps) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
      {/* Decorative: the technology name is rendered as text */}
      <Image src={src} width={20} height={20} alt="" className="h-5 w-5" />
      {name}
    </li>
  )
}
