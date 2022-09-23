import { Routes } from '@angular/router';
import { FacilityFormComponent } from 'app/facility-form/facility-form.component';
import { FacilityRoutes } from 'app/facility/facility-routes';
import { FacilityComponent } from 'app/facility/facility.component';
import { ParkFormComponent } from 'app/park-form/park-form.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { FacilityResolverService } from '../facility/facility-resolver.service';
import { AuthGuard } from '../guards/auth.guard';

export const ParkRoutes: Routes = [
  {
    path: '',
    redirectTo: 'details',
    pathMatch: 'full'
  },
  {
    path: 'details',
    component: ParkDetailsComponent,
    data: {
      breadcrumb: 'Park Details',
      module: 'park',
      component: 'details'
    }
  },
  {
    path: 'edit',
    component: ParkFormComponent,
    data: {
      breadcrumb: 'Edit Park',
      module: 'park',
      component: 'edit'
    }
  },
  {
    path: 'add-facility',
    component: FacilityFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add Facility',
      module: 'park',
      component: 'addFacility',
      roles: ['sysadmin']
    }
  },
  {
    path: 'facility/:facilityId',
    component: FacilityComponent,
    data: {
      breadcrumb: 'FACILITY NAME',
      module: 'facility',
      component: 'main'
    },
    children: FacilityRoutes,
    resolve: {
      facility: FacilityResolverService
    }
  }
];
