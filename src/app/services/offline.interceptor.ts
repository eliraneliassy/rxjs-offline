import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, throwError, of } from 'rxjs';
import { mapTo, retryWhen, switchMap, flatMap, concatMap, tap, filter } from 'rxjs/operators';
import { OfflineService } from './offline.service';

@Injectable({ providedIn: 'root' })
export class OfflineInterceptor implements HttpInterceptor {
    STORAGE_KEY = '__requests__';

    constructor(
        private handler: HttpHandler,
        private offlineService: OfflineService) {
        const requests = this.getReqs();
        of(requests).pipe(
            flatMap((reqs: Request[]) => reqs),
            concatMap((req) => this.handler.handle(req.req)
                .pipe(
                    tap(() => this.deleteReq(req))
                )
            ),
        );
    }

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retryWhen(errors => {
                if (window.navigator.onLine) {
                    return errors.pipe(switchMap(err => throwError(err)));
                }
                this.saveReq(req);
                return this.offlineService.isOnline.pipe(
                    filter(res => res)
                );
            })
        );
    }

    saveReq(req: HttpRequest<any>) {
        const requests = this.getReqs();
        requests.push({ req, key: new Date().getTime() });
        this.setReqs(requests);
    }

    deleteReq(req: Request) {
        let requests = this.getReqs();
        requests = requests.filter((r) => r.key !== req.key);
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
