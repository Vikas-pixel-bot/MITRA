import { MessageCircle } from 'lucide-react';
import { SpacePlaceholder } from '../_components/SpacePlaceholder';

export default function MitraChatPage() {
  return (
    <SpacePlaceholder
      icon={MessageCircle}
      title="MITRA"
      promise="Whenever I feel unsure, I know I can simply ask MITRA and receive calm, practical, trustworthy guidance."
      purpose="Your thinking partner — for making decisions, solving problems, reflecting, and documenting work, by voice or text."
      hint="Conversation coming next."
    />
  );
}
