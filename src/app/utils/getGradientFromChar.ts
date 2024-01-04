const getGradientFromChar = (char: string) => {
  const generateColor = (charCode: number, offset: number): string => {
    const baseHue = (charCode * 137) % 360;
    const hue = (baseHue + offset) % 360;
    const saturation = 70;
    const lightness = 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const charCode = char.charCodeAt(0);
  const color1 = generateColor(charCode, 0);
  const color2 = generateColor(charCode, 15);

  return `background: linear-gradient(0, ${color1}, ${color2})`;
};

export default getGradientFromChar;
