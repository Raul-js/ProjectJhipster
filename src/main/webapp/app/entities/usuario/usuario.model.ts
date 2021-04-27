import { ICarrito } from 'app/entities/carrito/carrito.model';
import { IFactura } from 'app/entities/factura/factura.model';

export interface IUsuario {
  id?: number;
  nombre?: string | null;
  apellido1?: string | null;
  apellido2?: string | null;
  email?: string | null;
  password?: string | null;
  carritos?: ICarrito[] | null;
  facturas?: IFactura[] | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public apellido1?: string | null,
    public apellido2?: string | null,
    public email?: string | null,
    public password?: string | null,
    public carritos?: ICarrito[] | null,
    public facturas?: IFactura[] | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
