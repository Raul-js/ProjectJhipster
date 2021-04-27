import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITipoProducto } from '../tipo-producto.model';

@Component({
  selector: 'jhi-tipo-producto-detail',
  templateUrl: './tipo-producto-detail.component.html',
})
export class TipoProductoDetailComponent implements OnInit {
  tipoProducto: ITipoProducto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoProducto }) => {
      this.tipoProducto = tipoProducto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
