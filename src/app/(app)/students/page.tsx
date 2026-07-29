import { Users } from 'lucide-react';
import { SpacePlaceholder } from '../_components/SpacePlaceholder';

export default function StudentsPage() {
  return (
    <SpacePlaceholder
      icon={Users}
      title="Students"
      promise="Every child who needs attention is visible, and I always know who requires my support next."
      purpose="A living profile for every residential student — health, growth, and safety, not just academic marks."
      hint="Student profiles coming next."
    />
  );
}
