import GlassPane from '@/components/GlassPane';
import { Rocket } from 'lucide-react';
export default function ProductPane() {
  return (
    <GlassPane label="Product" route="/product" index={1}>
      <div className="pane-flex">
        <Rocket size={32} strokeWidth={2.2} />
        <span>Product</span>
      </div>
    </GlassPane>
  );
}