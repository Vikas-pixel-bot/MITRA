import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function AdministrationPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-morning-sun/15">
        <Settings className="h-6 w-6 text-morning-sun-strong" />
      </div>
      <h1 className="text-lg font-semibold text-moon">Administration &amp; Settings</h1>
      <p className="max-w-xs text-sm text-earth">
        Daily duties, inspections, documentation, compliance, and account settings — tucked away
        here since they&apos;re not a frequent destination. Coming next.
      </p>
      <Link href="/me" className="text-sm font-medium text-river underline-offset-4 hover:underline">
        Back to Me
      </Link>
    </main>
  );
}
