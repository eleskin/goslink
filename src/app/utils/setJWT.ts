const setJWT = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem('accessToken', `Bearer ${accessToken}`);
  if (refreshToken) localStorage.setItem('refreshToken', `Bearer ${refreshToken}`);
};

export default setJWT;
