import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TipoProductoDetailComponent } from './tipo-producto-detail.component';

describe('Component Tests', () => {
  describe('TipoProducto Management Detail Component', () => {
    let comp: TipoProductoDetailComponent;
    let fixture: ComponentFixture<TipoProductoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TipoProductoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ tipoProducto: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TipoProductoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TipoProductoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tipoProducto on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tipoProducto).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
