import GlassPane from '@/components/GlassPane';
import { Mail } from 'lucide-react';
export default function ContactPane() {
  return (
    <GlassPane label="Contact" route="/contact" index={2}>
      <div className="pane-flex">
        <Mail size={32} strokeWidth={2.2} />
        <span>Contact</span>
      </div>
    </GlassPane>
  );
}