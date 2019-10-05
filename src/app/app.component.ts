import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  FilterOrdersComponent,
} from './components/filter-orders/filter-orders.component';
import { AuthService } from './services/auth.service';
import { HubService } from './services/hub.service';
import { Roles } from './services/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private _show = false;
  showFilterButton = false;
  constructor(private auth: AuthService,
    private router: Router,
    public media: MediaObserver,
    private hub: HubService,
    private dialog: MatDialog
   ) { }

  get displayAccountIcons() {
    return this._show;
  }

  showFilter() {
    this.dialog.open(FilterOrdersComponent, {
      width: '550px',
    });
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

    this.auth.user.subscribe(async (u) => {
      if (u.roles && u.roles.includes(Roles.Admin)) {
        console.log('admin');
        this._show = true;
      } else {
        this._show = false;
      }

      if (u.name) {
        await this.hub.start();
      } else {
        await this.hub.stop();
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.showFilterButton = event.url === '/orders');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
