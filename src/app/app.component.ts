import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { HubService } from './services/hub.service';
import { Roles } from './services/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _show = false;
  constructor(private auth: AuthService,
    private router: Router,
    public media: MediaObserver,
    private hub: HubService) { }

  get displayAccountIcons() {
    return this._show;
  }

  ngOnInit() {
    if (!this.auth.user.value.name) {
      this.auth.getUser().subscribe(() => {},
        () => {
          this.auth.logout();
          this.router.navigate(['login']);
        }
      );
    }

    this.auth.user.subscribe(u => {
      if (u.roles && u.roles.includes(Roles.Admin)) {
        console.log('show');
        this._show = true;
      } else {
        this._show = false;
      }
    });

    this.hub.start();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
