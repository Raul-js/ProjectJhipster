import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuario } from '../usuario.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { UsuarioService } from '../service/usuario.service';
import { UsuarioDeleteDialogComponent } from '../delete/usuario-delete-dialog.component';
import { FormBuilder } from '@angular/forms';
import { UsuarioFilter } from './usuario.filter';
@Component({
  selector: 'jhi-usuario',
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
  usuarios?: IUsuario[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  filterForm = this.fb.group({
    filterNombre: [],
    filterEmail: [],
  });

  filtros: UsuarioFilter = new UsuarioFilter();
  constructor(
    protected fb: FormBuilder,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}
  filter(): void {
    this.createFilterFromForm();
    this.loadPage();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.usuarioService
      .query({
        filter: this.filtros.toMap(),
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IUsuario[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IUsuario): number {
    return item.id!;
  }

  delete(usuario: IUsuario): void {
    const modalRef = this.modalService.open(UsuarioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usuario = usuario;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IUsuario[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/usuario'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.usuarios = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  private createFilterFromForm(): void {
    this.filtros.nombre = this.filterForm.get(['filterNombre'])!.value;
    this.filtros.email = this.filterForm.get(['filterEmail'])!.value;
  }
}
