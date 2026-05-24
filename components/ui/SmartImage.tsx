import Image from "next/image";
import { getImagePriority } from "@/lib/utils/imagePriority";

interface Props {
  src: string;
  alt: string;
  index?: number;
  fill?: boolean;
  className?: string;
}

export default function SmartImage({
  src,
  alt,
  index = 0,
  fill = true,
  className,
}: Props) {
  const priority = getImagePriority(index);

  return (
    <Image
      src={src || "/fallback.jpg"}
      alt={alt}
      fill={fill}
      className={className}
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={priority === "high"}
      loading={priority === "high" ? "eager" : "lazy"}
      quality={75}
      placeholder="blur"
      blurDataURL="/fallback.jpg"
    />
  );
}