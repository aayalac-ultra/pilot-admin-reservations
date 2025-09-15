import { HttpInterceptorFn } from '@angular/common/http';

// Stub Auth Interceptor – future: attach JWT / SSO token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Example placeholder header
  const cloned = req.clone({
    setHeaders: {
      'X-Auth-Stub': 'true'
    }
  });
  return next(cloned);
};
