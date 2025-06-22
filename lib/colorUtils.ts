export const rgba = (hex: string, a: number) =>
  `rgba(${parseInt(hex.slice(1,3),16)},
        ${parseInt(hex.slice(3,5),16)},
        ${parseInt(hex.slice(5,7),16)},${a})`;

export const rgba0 = (hex: string) => rgba(hex, 0);
