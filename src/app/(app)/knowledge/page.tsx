import { BookOpen } from 'lucide-react';
import { SpacePlaceholder } from '../_components/SpacePlaceholder';

export default function KnowledgePage() {
  return (
    <SpacePlaceholder
      icon={BookOpen}
      title="Knowledge"
      promise="Whenever I don't know what to do, MITRA gives me the right guidance, backed by official SOPs and adapted to my situation."
      purpose="Every manual, circular, and SOP turned into actionable playbooks — always cited to its official source."
      hint="Guidance library coming next."
    />
  );
}
