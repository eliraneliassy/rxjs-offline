import { Component, OnInit } from '@angular/core';
import { OfflineService } from './services/offline.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isOnline$: Observable<boolean>;
  constructor(private offlineService: OfflineService) { }
  ngOnInit(): void {
    this.isOnline$ = this.offlineService.isOnline;

    this.offlineService.isOnline.subscribe(console.log);
  }
}
