import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export const httpTimingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = performance.now();
  return next(req).pipe(
    finalize(() => {
      const elapsed = performance.now() - start;
      // Simple timing log stub
      console.log('[HTTP TIMING]', req.method, req.url, `${elapsed.toFixed(1)}ms`);
    })
  );
};
