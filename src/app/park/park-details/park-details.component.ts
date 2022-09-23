import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkService } from 'app/services/park.service';
import { takeWhile } from 'rxjs/operators';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss']
})
export class ParkDetailsComponent implements OnInit, OnDestroy {
  private alive = true;

  public isAdmin = false;
  public loading = true;
  public park;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    private keyCloakService: KeycloakService,
    private route: ActivatedRoute,
    private parkService: ParkService
  ) { }

  ngOnInit() {
    this.isAdmin = this.keyCloakService.isAuthorized(['sysadmin']);
    this.parkService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.park = res;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  editPark() {
    this.router.navigate(['../edit'], { relativeTo: this.route });
  }

  addParkFacility() {
    this.router.navigate(['../', 'add-facility'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
