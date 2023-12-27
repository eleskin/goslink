const truncate = (string: string = '', length: number) => {
  return string.length > length ? string.slice(0, length) + '...' : string;
};

export default truncate;
