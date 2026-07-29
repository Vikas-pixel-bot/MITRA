export default function TodayPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center [padding-top:max(2.5rem,env(safe-area-inset-top))] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
      <h1 className="text-xl font-semibold text-moon">Today</h1>
      <p className="max-w-xs text-sm text-earth">
        Your daily operating centre — what needs your attention right now. Coming next.
      </p>
    </main>
  );
}
