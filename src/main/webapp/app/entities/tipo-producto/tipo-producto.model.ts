import { IProducto } from 'app/entities/producto/producto.model';

export interface ITipoProducto {
  id?: number;
  nombreTipoProducto?: string | null;
  productos?: IProducto[] | null;
}

export class TipoProducto implements ITipoProducto {
  constructor(public id?: number, public nombreTipoProducto?: string | null, public productos?: IProducto[] | null) {}
}

export function getTipoProductoIdentifier(tipoProducto: ITipoProducto): number | undefined {
  return tipoProducto.id;
}
