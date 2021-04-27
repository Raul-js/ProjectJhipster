import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProducto, Producto } from '../producto.model';
import { ProductoService } from '../service/producto.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICarrito } from 'app/entities/carrito/carrito.model';
import { CarritoService } from 'app/entities/carrito/service/carrito.service';
import { ITipoProducto } from 'app/entities/tipo-producto/tipo-producto.model';
import { TipoProductoService } from 'app/entities/tipo-producto/service/tipo-producto.service';

@Component({
  selector: 'jhi-producto-update',
  templateUrl: './producto-update.component.html',
})
export class ProductoUpdateComponent implements OnInit {
  isSaving = false;

  carritosSharedCollection: ICarrito[] = [];
  tipoProductosSharedCollection: ITipoProducto[] = [];

  editForm = this.fb.group({
    id: [],
    nombreProducto: [],
    ingredientes: [],
    calorias: [],
    imagen: [],
    imagenContentType: [],
    precio: [],
    existencias: [],
    carritos: [],
    tipoproducto: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected productoService: ProductoService,
    protected carritoService: CarritoService,
    protected tipoProductoService: TipoProductoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ producto }) => {
      this.updateForm(producto);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('grownpathApp.error', { message: err.message })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const producto = this.createFromForm();
    if (producto.id !== undefined) {
      this.subscribeToSaveResponse(this.productoService.update(producto));
    } else {
      this.subscribeToSaveResponse(this.productoService.create(producto));
    }
  }

  trackCarritoById(index: number, item: ICarrito): number {
    return item.id!;
  }

  trackTipoProductoById(index: number, item: ITipoProducto): number {
    return item.id!;
  }

  getSelectedCarrito(option: ICarrito, selectedVals?: ICarrito[]): ICarrito {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProducto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(producto: IProducto): void {
    this.editForm.patchValue({
      id: producto.id,
      nombreProducto: producto.nombreProducto,
      ingredientes: producto.ingredientes,
      calorias: producto.calorias,
      imagen: producto.imagen,
      imagenContentType: producto.imagenContentType,
      precio: producto.precio,
      existencias: producto.existencias,
      carritos: producto.carritos,
      tipoproducto: producto.tipoproducto,
    });

    this.carritosSharedCollection = this.carritoService.addCarritoToCollectionIfMissing(
      this.carritosSharedCollection,
      ...(producto.carritos ?? [])
    );
    this.tipoProductosSharedCollection = this.tipoProductoService.addTipoProductoToCollectionIfMissing(
      this.tipoProductosSharedCollection,
      producto.tipoproducto
    );
  }

  protected loadRelationshipsOptions(): void {
    this.carritoService
      .query()
      .pipe(map((res: HttpResponse<ICarrito[]>) => res.body ?? []))
      .pipe(
        map((carritos: ICarrito[]) =>
          this.carritoService.addCarritoToCollectionIfMissing(carritos, ...(this.editForm.get('carritos')!.value ?? []))
        )
      )
      .subscribe((carritos: ICarrito[]) => (this.carritosSharedCollection = carritos));

    this.tipoProductoService
      .query()
      .pipe(map((res: HttpResponse<ITipoProducto[]>) => res.body ?? []))
      .pipe(
        map((tipoProductos: ITipoProducto[]) =>
          this.tipoProductoService.addTipoProductoToCollectionIfMissing(tipoProductos, this.editForm.get('tipoproducto')!.value)
        )
      )
      .subscribe((tipoProductos: ITipoProducto[]) => (this.tipoProductosSharedCollection = tipoProductos));
  }

  protected createFromForm(): IProducto {
    return {
      ...new Producto(),
      id: this.editForm.get(['id'])!.value,
      nombreProducto: this.editForm.get(['nombreProducto'])!.value,
      ingredientes: this.editForm.get(['ingredientes'])!.value,
      calorias: this.editForm.get(['calorias'])!.value,
      imagenContentType: this.editForm.get(['imagenContentType'])!.value,
      imagen: this.editForm.get(['imagen'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      existencias: this.editForm.get(['existencias'])!.value,
      carritos: this.editForm.get(['carritos'])!.value,
      tipoproducto: this.editForm.get(['tipoproducto'])!.value,
    };
  }
}
