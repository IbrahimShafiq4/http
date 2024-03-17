import {
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
  HttpInterceptor,
  HttpEvent,
  HttpHandlerFn,
  HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const modifiedRequest = req.clone({
    headers: req.headers.append('ibrahim', 'shafiqTwo').append('Auth', 'XYZ'),
  });

  return next(modifiedRequest);
};
