import { Injectable } from '@angular/core';
import { mapTo, startWith } from 'rxjs/operators';
import { fromEvent, Observable, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  private isOnline$: Observable<boolean> = merge(
    fromEvent(window, 'online').pipe(mapTo(true)),
    fromEvent(window, 'offline').pipe(mapTo(false)),
  ).pipe(
    startWith(window.navigator.onLine)
  );

  get isOnline() {
    return this.isOnline$;
  }



  constructor() { }
}
