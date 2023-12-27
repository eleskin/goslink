const removeJWT = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export default removeJWT;
