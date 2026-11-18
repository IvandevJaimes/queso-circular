import logoQueso from '../../../assets/Gemini_Generated_Image_ypgsf1ypgsf1ypgs_1_-removebg-preview.png';
import { cn } from '../../utils/cn';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        <img
          src={logoQueso}
          alt="Logo Queso Circular IA"
          className="h-full w-full scale-[1.65] object-contain select-none"
        />
      </span>

      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-base">
          Queso Circular
        </span>
        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
          IA
        </span>
      </div>
    </div>
  );
}
