import {HttpInterceptorFn} from '@angular/common/http';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', localStorage.getItem('accessToken') ?? ''),
  });
  return next(reqWithHeader);
};
