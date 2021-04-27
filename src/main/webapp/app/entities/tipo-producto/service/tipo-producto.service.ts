import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoProducto, getTipoProductoIdentifier } from '../tipo-producto.model';

export type EntityResponseType = HttpResponse<ITipoProducto>;
export type EntityArrayResponseType = HttpResponse<ITipoProducto[]>;

@Injectable({ providedIn: 'root' })
export class TipoProductoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-productos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(tipoProducto: ITipoProducto): Observable<EntityResponseType> {
    return this.http.post<ITipoProducto>(this.resourceUrl, tipoProducto, { observe: 'response' });
  }

  update(tipoProducto: ITipoProducto): Observable<EntityResponseType> {
    return this.http.put<ITipoProducto>(`${this.resourceUrl}/${getTipoProductoIdentifier(tipoProducto) as number}`, tipoProducto, {
      observe: 'response',
    });
  }

  partialUpdate(tipoProducto: ITipoProducto): Observable<EntityResponseType> {
    return this.http.patch<ITipoProducto>(`${this.resourceUrl}/${getTipoProductoIdentifier(tipoProducto) as number}`, tipoProducto, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoProducto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoProducto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTipoProductoToCollectionIfMissing(
    tipoProductoCollection: ITipoProducto[],
    ...tipoProductosToCheck: (ITipoProducto | null | undefined)[]
  ): ITipoProducto[] {
    const tipoProductos: ITipoProducto[] = tipoProductosToCheck.filter(isPresent);
    if (tipoProductos.length > 0) {
      const tipoProductoCollectionIdentifiers = tipoProductoCollection.map(
        tipoProductoItem => getTipoProductoIdentifier(tipoProductoItem)!
      );
      const tipoProductosToAdd = tipoProductos.filter(tipoProductoItem => {
        const tipoProductoIdentifier = getTipoProductoIdentifier(tipoProductoItem);
        if (tipoProductoIdentifier == null || tipoProductoCollectionIdentifiers.includes(tipoProductoIdentifier)) {
          return false;
        }
        tipoProductoCollectionIdentifiers.push(tipoProductoIdentifier);
        return true;
      });
      return [...tipoProductosToAdd, ...tipoProductoCollection];
    }
    return tipoProductoCollection;
  }
}
