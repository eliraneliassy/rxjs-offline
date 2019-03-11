import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, fromEvent, throwError, of, EMPTY, merge, from} from 'rxjs';
import {mapTo, retryWhen, switchMap, flatMap, concatMap, tap, catchError, startWith, filter, take} from 'rxjs/operators';
import {Address} from '../address.interface';
import {ApiService} from './api.service';
import {OfflineService} from './offline.service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {

  get isOnline() {
    return navigator.onLine;
  }

  constructor(private http: HttpClient, private offline: OfflineService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(errors => {
          if (!this.isOnline) {
            this.offline.saveReq(req);
            return EMPTY;
          }
          return of(errors);
        })
    );
  }
}
