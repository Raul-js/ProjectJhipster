import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TipoProductoComponent } from './list/tipo-producto.component';
import { TipoProductoDetailComponent } from './detail/tipo-producto-detail.component';
import { TipoProductoUpdateComponent } from './update/tipo-producto-update.component';
import { TipoProductoDeleteDialogComponent } from './delete/tipo-producto-delete-dialog.component';
import { TipoProductoRoutingModule } from './route/tipo-producto-routing.module';

@NgModule({
  imports: [SharedModule, TipoProductoRoutingModule],
  declarations: [TipoProductoComponent, TipoProductoDetailComponent, TipoProductoUpdateComponent, TipoProductoDeleteDialogComponent],
  entryComponents: [TipoProductoDeleteDialogComponent],
})
export class TipoProductoModule {}
