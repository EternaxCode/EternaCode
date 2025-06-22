interface IconProps{
  name? : string;      // ex) 'about' → /assets/ico-about.svg
  size?: number;      // px, 필요시 override
}
export default function Icon({ name, size }: IconProps){
  if(!name) return <></>
  const url = `/assets/ico-${name}.svg`;
  return (
    <div
      className="icon-mask"
      style={{
        WebkitMask: `url('${url}') center/contain no-repeat`,
        mask      : `url('${url}') center/contain no-repeat`,
        ...(size && { width: size, height: size }),
      }}
    />
  );
}
