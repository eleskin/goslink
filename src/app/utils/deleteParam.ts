const deleteParam = (url: string, param: string) => {
  const [basePath, queryString] = url.split('?');
  const searchParams = new URLSearchParams(queryString);
  searchParams.delete(param);
  const newQueryString = searchParams.toString();

  return  basePath + (newQueryString ? `?${newQueryString}` : '');
};

export default deleteParam;
