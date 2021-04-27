import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TipoProductoComponent } from '../list/tipo-producto.component';
import { TipoProductoDetailComponent } from '../detail/tipo-producto-detail.component';
import { TipoProductoUpdateComponent } from '../update/tipo-producto-update.component';
import { TipoProductoRoutingResolveService } from './tipo-producto-routing-resolve.service';

const tipoProductoRoute: Routes = [
  {
    path: '',
    component: TipoProductoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TipoProductoDetailComponent,
    resolve: {
      tipoProducto: TipoProductoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TipoProductoUpdateComponent,
    resolve: {
      tipoProducto: TipoProductoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TipoProductoUpdateComponent,
    resolve: {
      tipoProducto: TipoProductoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tipoProductoRoute)],
  exports: [RouterModule],
})
export class TipoProductoRoutingModule {}
