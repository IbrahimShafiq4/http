import {
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs';

export const loggerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  console.log('Outgoing Request');
  console.log(req.url);
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log('Incoming Response');
      console.log(event.body)
    }
  }));
};
