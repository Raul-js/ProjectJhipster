jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TipoProductoService } from '../service/tipo-producto.service';
import { ITipoProducto, TipoProducto } from '../tipo-producto.model';

import { TipoProductoUpdateComponent } from './tipo-producto-update.component';

describe('Component Tests', () => {
  describe('TipoProducto Management Update Component', () => {
    let comp: TipoProductoUpdateComponent;
    let fixture: ComponentFixture<TipoProductoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tipoProductoService: TipoProductoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TipoProductoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TipoProductoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TipoProductoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tipoProductoService = TestBed.inject(TipoProductoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const tipoProducto: ITipoProducto = { id: 456 };

        activatedRoute.data = of({ tipoProducto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tipoProducto));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tipoProducto = { id: 123 };
        spyOn(tipoProductoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tipoProducto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tipoProducto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tipoProductoService.update).toHaveBeenCalledWith(tipoProducto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tipoProducto = new TipoProducto();
        spyOn(tipoProductoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tipoProducto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tipoProducto }));
        saveSubject.complete();

        // THEN
        expect(tipoProductoService.create).toHaveBeenCalledWith(tipoProducto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tipoProducto = { id: 123 };
        spyOn(tipoProductoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tipoProducto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tipoProductoService.update).toHaveBeenCalledWith(tipoProducto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
