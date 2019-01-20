import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private _connection: any;

  public get connection(): signalR.HubConnection {
    return this._connection;
  }

  timer: any;
  restartInterval = 10000;
  message: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private auth: AuthService) {}

  start() {
    if (!this.auth.isAuthorized) {
      return;
    }

    if (this.connection && this._connection.connection.connectionState === 1) {
      this.stop();
    }

    this._connection = new signalR
      .HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}`, { accessTokenFactory: () => this.auth.getToken() })
      .build();

    this.connection.start();

    this.connection.on('notify', (msg: any) => this.message.next(msg));

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      if (!this.connection || this._connection.connection.connectionState !== 1) {
        this.stop();
        this.start();
        console.log('---------------- Socket client restarted ----------------');
      }
    }, this.restartInterval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    try {
      if (this.connection) {
        this.connection.stop();
      }
    } catch {

    }
  }
}
