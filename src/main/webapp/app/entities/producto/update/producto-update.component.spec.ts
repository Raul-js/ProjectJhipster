jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductoService } from '../service/producto.service';
import { IProducto, Producto } from '../producto.model';
import { ICarrito } from 'app/entities/carrito/carrito.model';
import { CarritoService } from 'app/entities/carrito/service/carrito.service';
import { ITipoProducto } from 'app/entities/tipo-producto/tipo-producto.model';
import { TipoProductoService } from 'app/entities/tipo-producto/service/tipo-producto.service';

import { ProductoUpdateComponent } from './producto-update.component';

describe('Component Tests', () => {
  describe('Producto Management Update Component', () => {
    let comp: ProductoUpdateComponent;
    let fixture: ComponentFixture<ProductoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productoService: ProductoService;
    let carritoService: CarritoService;
    let tipoProductoService: TipoProductoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productoService = TestBed.inject(ProductoService);
      carritoService = TestBed.inject(CarritoService);
      tipoProductoService = TestBed.inject(TipoProductoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Carrito query and add missing value', () => {
        const producto: IProducto = { id: 456 };
        const carritos: ICarrito[] = [{ id: 61239 }];
        producto.carritos = carritos;

        const carritoCollection: ICarrito[] = [{ id: 47990 }];
        spyOn(carritoService, 'query').and.returnValue(of(new HttpResponse({ body: carritoCollection })));
        const additionalCarritos = [...carritos];
        const expectedCollection: ICarrito[] = [...additionalCarritos, ...carritoCollection];
        spyOn(carritoService, 'addCarritoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        expect(carritoService.query).toHaveBeenCalled();
        expect(carritoService.addCarritoToCollectionIfMissing).toHaveBeenCalledWith(carritoCollection, ...additionalCarritos);
        expect(comp.carritosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call TipoProducto query and add missing value', () => {
        const producto: IProducto = { id: 456 };
        const tipoproducto: ITipoProducto = { id: 56048 };
        producto.tipoproducto = tipoproducto;

        const tipoProductoCollection: ITipoProducto[] = [{ id: 78888 }];
        spyOn(tipoProductoService, 'query').and.returnValue(of(new HttpResponse({ body: tipoProductoCollection })));
        const additionalTipoProductos = [tipoproducto];
        const expectedCollection: ITipoProducto[] = [...additionalTipoProductos, ...tipoProductoCollection];
        spyOn(tipoProductoService, 'addTipoProductoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        expect(tipoProductoService.query).toHaveBeenCalled();
        expect(tipoProductoService.addTipoProductoToCollectionIfMissing).toHaveBeenCalledWith(
          tipoProductoCollection,
          ...additionalTipoProductos
        );
        expect(comp.tipoProductosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const producto: IProducto = { id: 456 };
        const carritos: ICarrito = { id: 16288 };
        producto.carritos = [carritos];
        const tipoproducto: ITipoProducto = { id: 31433 };
        producto.tipoproducto = tipoproducto;

        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(producto));
        expect(comp.carritosSharedCollection).toContain(carritos);
        expect(comp.tipoProductosSharedCollection).toContain(tipoproducto);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const producto = { id: 123 };
        spyOn(productoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: producto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productoService.update).toHaveBeenCalledWith(producto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const producto = new Producto();
        spyOn(productoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: producto }));
        saveSubject.complete();

        // THEN
        expect(productoService.create).toHaveBeenCalledWith(producto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const producto = { id: 123 };
        spyOn(productoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ producto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productoService.update).toHaveBeenCalledWith(producto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCarritoById', () => {
        it('Should return tracked Carrito primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCarritoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTipoProductoById', () => {
        it('Should return tracked TipoProducto primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTipoProductoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCarrito', () => {
        it('Should return option if no Carrito is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCarrito(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Carrito for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCarrito(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Carrito is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCarrito(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
