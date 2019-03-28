import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpParams, HttpBackend} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, fromEvent, throwError, of, EMPTY, merge, from} from 'rxjs';
import {mapTo, retryWhen, switchMap, flatMap, concatMap, tap, catchError, startWith, filter, take} from 'rxjs/operators';
import {Address} from '../address.interface';
import {ApiService} from './api.service';

@Injectable({providedIn: 'root'})
export class OfflineService {
  STORAGE_KEY = '__requests__';

  get isOnline() {
    return navigator.onLine;
  }

  constructor(private handler: HttpBackend) {
    fromEvent(window, 'online')
        .pipe(
            startWith(this.isOnline),
            filter((isOnline: boolean) => isOnline),
            flatMap(() => this.getReqs()),
            concatMap((req: Request) => {
              const httpRequest = new HttpRequest(req.req.method, req.req.url, req.req.body);
              return this.handler.handle(httpRequest)
                .pipe(
                    tap(() => this.deleteReq(req.key))
                );
              }
            ),
        )
        .subscribe();
  }

  saveReq(req: HttpRequest<any>) {
    const requests = this.getReqs();
    requests.push({req, key: new Date().getTime()});
    this.setReqs(requests);
  }

  deleteReq(key: Request['key']) {
    let requests = this.getReqs();
    requests     = requests.filter((r) => r.key !== key);
    this.setReqs(requests);
  }

  getReqs(): Request[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  setReqs(reqs: Request[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reqs));
  }

}

export interface Request {
  key: number;
  req: HttpRequest<any>;
}
