import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoProducto, TipoProducto } from '../tipo-producto.model';
import { TipoProductoService } from '../service/tipo-producto.service';

@Injectable({ providedIn: 'root' })
export class TipoProductoRoutingResolveService implements Resolve<ITipoProducto> {
  constructor(protected service: TipoProductoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITipoProducto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tipoProducto: HttpResponse<TipoProducto>) => {
          if (tipoProducto.body) {
            return of(tipoProducto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TipoProducto());
  }
}
