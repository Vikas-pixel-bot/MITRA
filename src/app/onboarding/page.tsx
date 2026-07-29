import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6 py-10 text-center [padding-top:max(2.5rem,env(safe-area-inset-top))] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-moon">
          Which language would you like to talk in?
        </h1>
        <p className="text-sm text-earth">
          Marathi · Hindi · English — coming next.
        </p>
      </div>
      <Link
        href="/"
        className="text-sm font-medium text-river underline-offset-4 hover:underline"
      >
        Back to Welcome
      </Link>
    </main>
  );
}
