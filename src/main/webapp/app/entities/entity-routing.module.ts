import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'producto',
        data: { pageTitle: 'Productos' },
        loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
      },
      {
        path: 'tipo-producto',
        data: { pageTitle: 'TipoProductos' },
        loadChildren: () => import('./tipo-producto/tipo-producto.module').then(m => m.TipoProductoModule),
      },
      {
        path: 'carrito',
        data: { pageTitle: 'Carritos' },
        loadChildren: () => import('./carrito/carrito.module').then(m => m.CarritoModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'Usuarios' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'factura',
        data: { pageTitle: 'Facturas' },
        loadChildren: () => import('./factura/factura.module').then(m => m.FacturaModule),
      },
      {
        path: 'compra',
        data: { pageTitle: 'Compras' },
        loadChildren: () => import('./compra/compra.module').then(m => m.CompraModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
