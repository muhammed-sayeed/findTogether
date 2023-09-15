import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, retry, throwError } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable()
export class errorInterceptor implements HttpInterceptor {
  private maxAttempt = 3;
  private readonly statusCode = [500];
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      retry(this.maxAttempt),
      catchError((error: HttpErrorResponse) => {
        if (this.statusCode.includes(error.status)) {
          return this.retryRequest(req, next);
        } else if (error.status == 401) {
        } else {
        }

        return throwError(error);
      })
    );
  }

  private retryRequest(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.maxAttempt--;
    return next.handle(req).pipe(
      retry(1),
      catchError((error) => {
        if (this.maxAttempt <= 0) {
          return throwError('maximum attempt reached');
        }
        return this.retryRequest(req, next);
      })
    );
  }
}
