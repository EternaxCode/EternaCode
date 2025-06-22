import GlassPane from '@/components/GlassPane';
import Icon      from '@/components/Icon';

interface MenuPaneProps{
  label : 'About' | 'Product' | 'Contact';
  route : string;
  icon?  : string;                // 아이콘 이름(이미지 파일 접두사)
  index : number;
  big?  : boolean;               // 좌측 상단 로고용(큰 사이즈)
}

export default function MenuPane({ label, route, icon, index, big }: MenuPaneProps){
  return (
    <GlassPane label={label} route={route} index={index}>
      <div style={{display:'flex',alignItems:'center',gap:'0.9rem',pointerEvents:'none'}}>
        {icon ? <Icon name={icon} size={big ? 140 : undefined} /> : ''}
        {!big && <span>{label}</span>}
      </div>
    </GlassPane>
  );
}
