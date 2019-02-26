import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hub: signalR.HubConnection;
  private timer: any;
  message: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private auth: AuthService) {}

  async start() {
    if (!this.auth.isAuthorized) {
      return;
    }

    this.hub = new signalR
      .HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}`, { accessTokenFactory: () => this.auth.getToken() })
      .build();

    await this.connect();

    this.hub.onclose(async () => {
      await this.connect();
    });

    this.hub.on('notify', (msg: any) => this.message.next(msg));
  }

  private async connect() {
    try {
      await this.hub.start();
    } catch {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(async () => {
        await this.hub.start();
      }, 5000);
    }
  }
}
