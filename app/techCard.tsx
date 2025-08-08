// components/TechCard.tsx
import { Card } from '@/components/ui/card';
import Image from 'next/image';

type TechCardProps = {
  src: string;
  alt: string;
  tech_name: string;
};

export default function TechCard({ src, alt, tech_name}: TechCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-4 text-center border border-gray-200 dark:border-gray-700 custom-shadow transition-all hover:custom-shadow-lg hover:scale-105">
        <Image
          src={src}
          width="64"
          height="64"
          alt={alt}
          className="mb-2"
        />
        <h4 className="font-semibold">{tech_name}</h4>
      </Card>
  );
}
