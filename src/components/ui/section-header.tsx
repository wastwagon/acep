import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** `center` for band intros; `left` for editorial columns */
  align?: "center" | "left";
  className?: string;
};

/**
 * Shared homepage / marketing section intro — matches hero editorial system
 * (eyebrow + `font-display` title + optional description).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500",
            isCenter && "mx-auto max-w-xl",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-slate-900 md:text-[2.15rem]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7 text-slate-600",
            isCenter && "mx-auto max-w-3xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
