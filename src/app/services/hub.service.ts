import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hub: signalR.HubConnection;
  message: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private auth: AuthService) {}

  async start() {
    if (!this.auth.isAuthorized()) {
      return;
    }
    this.hub = new signalR
      .HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}`, { accessTokenFactory: () => this.auth.getToken() })
      .withAutomaticReconnect()
      .build();

    await this.hub.start();

    this.hub.onclose(async () => await this.hub.start());

    this.hub.onreconnecting(error => console.log('reconnecting signalR ', error));

    this.hub.on('notify', (msg: any) => this.message.next(msg));
  }

  async stop() {
    return this.hub && await this.hub.stop();
  }
}
