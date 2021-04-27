import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICarrito, Carrito } from '../carrito.model';
import { CarritoService } from '../service/carrito.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-carrito-update',
  templateUrl: './carrito-update.component.html',
})
export class CarritoUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    cantidad: [],
    fechaCarrito: [],
    usuario: [],
  });

  constructor(
    protected carritoService: CarritoService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ carrito }) => {
      if (carrito.id === undefined) {
        const today = dayjs().startOf('day');
        carrito.fechaCarrito = today;
      }

      this.updateForm(carrito);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const carrito = this.createFromForm();
    if (carrito.id !== undefined) {
      this.subscribeToSaveResponse(this.carritoService.update(carrito));
    } else {
      this.subscribeToSaveResponse(this.carritoService.create(carrito));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICarrito>>): void {
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

  protected updateForm(carrito: ICarrito): void {
    this.editForm.patchValue({
      id: carrito.id,
      cantidad: carrito.cantidad,
      fechaCarrito: carrito.fechaCarrito ? carrito.fechaCarrito.format(DATE_TIME_FORMAT) : null,
      usuario: carrito.usuario,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.usuariosSharedCollection, carrito.usuario);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('usuario')!.value))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }

  protected createFromForm(): ICarrito {
    return {
      ...new Carrito(),
      id: this.editForm.get(['id'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
      fechaCarrito: this.editForm.get(['fechaCarrito'])!.value
        ? dayjs(this.editForm.get(['fechaCarrito'])!.value, DATE_TIME_FORMAT)
        : undefined,
      usuario: this.editForm.get(['usuario'])!.value,
    };
  }
}
