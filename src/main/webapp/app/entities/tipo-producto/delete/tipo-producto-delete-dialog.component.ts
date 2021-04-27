import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipoProducto } from '../tipo-producto.model';
import { TipoProductoService } from '../service/tipo-producto.service';

@Component({
  templateUrl: './tipo-producto-delete-dialog.component.html',
})
export class TipoProductoDeleteDialogComponent {
  tipoProducto?: ITipoProducto;

  constructor(protected tipoProductoService: TipoProductoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tipoProductoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
