import { Component } from '@angular/core';
import {fromEvent, merge, of} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {OfflineService} from './services/offline.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isOffline$ = merge(
      of(!navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(false)),
      fromEvent(window, 'offline').pipe(mapTo(true)),
  );

  constructor(private offline: OfflineService) {}

}
