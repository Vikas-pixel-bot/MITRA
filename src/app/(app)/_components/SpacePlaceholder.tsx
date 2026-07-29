import type { LucideIcon } from 'lucide-react';

export function SpacePlaceholder({
  icon: Icon,
  title,
  promise,
  purpose,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  promise: string;
  purpose: string;
  hint?: string;
}) {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-5 px-6 py-10 text-center [padding-top:max(2.5rem,env(safe-area-inset-top))]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-morning-sun/15">
        <Icon className="h-6 w-6 text-morning-sun-strong" />
      </div>
      <div className="max-w-xs space-y-3">
        <h1 className="text-xl font-semibold text-moon">{title}</h1>
        <p className="text-base italic leading-relaxed text-moon/80">&ldquo;{promise}&rdquo;</p>
        <p className="text-sm text-earth">{purpose}</p>
        {hint && <p className="text-xs text-moon/50">{hint}</p>}
      </div>
    </main>
  );
}
