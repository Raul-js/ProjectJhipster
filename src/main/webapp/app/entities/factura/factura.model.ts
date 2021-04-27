import * as dayjs from 'dayjs';
import { ICompra } from 'app/entities/compra/compra.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IFactura {
  id?: number;
  fechaFactura?: dayjs.Dayjs | null;
  cantidadPagada?: number | null;
  compras?: ICompra[] | null;
  usuario?: IUsuario | null;
}

export class Factura implements IFactura {
  constructor(
    public id?: number,
    public fechaFactura?: dayjs.Dayjs | null,
    public cantidadPagada?: number | null,
    public compras?: ICompra[] | null,
    public usuario?: IUsuario | null
  ) {}
}

export function getFacturaIdentifier(factura: IFactura): number | undefined {
  return factura.id;
}
