import GlassPane from '@/components/GlassPane';
export default function AboutPane() {
  return (
<GlassPane label="About" route="/about" index={0}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
            pointerEvents: 'none',      // 내부 요소가 이벤트 가로채지 않도록
          }}>
            <div className="logo-icon" style={{ pointerEvents: 'none' }} />
            <span style={{ pointerEvents: 'none' }}>About</span>
          </div>
        </GlassPane>
  );
}