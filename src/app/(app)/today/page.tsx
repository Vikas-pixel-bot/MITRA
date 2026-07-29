import { Sun } from 'lucide-react';
import { SpacePlaceholder } from '../_components/SpacePlaceholder';

export default function TodayPage() {
  return (
    <SpacePlaceholder
      icon={Sun}
      title="Today"
      promise="When I open MITRA, I immediately know what matters today, feel prepared for the day ahead, and confident that I won't overlook anything important."
      purpose="Your Daily Operating Centre — not a dashboard, a morning briefing that tells you the story of your day."
      hint="Full daily briefing coming next."
    />
  );
}
