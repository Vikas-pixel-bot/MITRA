import { UserRound } from 'lucide-react';
import { SpacePlaceholder } from '../_components/SpacePlaceholder';

export default function MePage() {
  return (
    <SpacePlaceholder
      icon={UserRound}
      title="Me"
      promise="Every month I become a calmer, more confident Superintendent."
      purpose="Your 30-day goal, reflections, and personal growth — plus Administration and Settings, tucked away here rather than the main bar."
      hint="Growth journey coming next."
    />
  );
}
