import { ICarrito } from 'app/entities/carrito/carrito.model';
import { ITipoProducto } from 'app/entities/tipo-producto/tipo-producto.model';

export interface IProducto {
  id?: number;
  nombreProducto?: string | null;
  ingredientes?: string | null;
  calorias?: number | null;
  imagenContentType?: string | null;
  imagen?: string | null;
  precio?: number | null;
  existencias?: number | null;
  carritos?: ICarrito[] | null;
  tipoproducto?: ITipoProducto | null;
}

export class Producto implements IProducto {
  constructor(
    public id?: number,
    public nombreProducto?: string | null,
    public ingredientes?: string | null,
    public calorias?: number | null,
    public imagenContentType?: string | null,
    public imagen?: string | null,
    public precio?: number | null,
    public existencias?: number | null,
    public carritos?: ICarrito[] | null,
    public tipoproducto?: ITipoProducto | null
  ) {}
}

export function getProductoIdentifier(producto: IProducto): number | undefined {
  return producto.id;
}
