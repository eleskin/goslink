const getGradientFromChar = (char: string) => {
  const generateColor = (charCode: number, offset: number) => {
    const baseRed = 128;
    const baseGreen = 64;
    const baseBlue = 192;

    const red = (baseRed + charCode * offset) % 256;
    const green = (baseGreen + charCode * offset * 2) % 256;
    const blue = (baseBlue + charCode * offset * 3) % 256;

    return `rgb(${red}, ${green}, ${blue})`;
  };

  const charCode = char.charCodeAt(0);

  const color1 = generateColor(charCode, 123);
  const color2 = generateColor(charCode, 321);

  return `background: linear-gradient(0, ${color1}, ${color2})`;
};

export default getGradientFromChar;
