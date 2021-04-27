import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITipoProducto, TipoProducto } from '../tipo-producto.model';

import { TipoProductoService } from './tipo-producto.service';

describe('Service Tests', () => {
  describe('TipoProducto Service', () => {
    let service: TipoProductoService;
    let httpMock: HttpTestingController;
    let elemDefault: ITipoProducto;
    let expectedResult: ITipoProducto | ITipoProducto[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TipoProductoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nombreTipoProducto: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TipoProducto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TipoProducto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TipoProducto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombreTipoProducto: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TipoProducto', () => {
        const patchObject = Object.assign(
          {
            nombreTipoProducto: 'BBBBBB',
          },
          new TipoProducto()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TipoProducto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombreTipoProducto: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TipoProducto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTipoProductoToCollectionIfMissing', () => {
        it('should add a TipoProducto to an empty array', () => {
          const tipoProducto: ITipoProducto = { id: 123 };
          expectedResult = service.addTipoProductoToCollectionIfMissing([], tipoProducto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tipoProducto);
        });

        it('should not add a TipoProducto to an array that contains it', () => {
          const tipoProducto: ITipoProducto = { id: 123 };
          const tipoProductoCollection: ITipoProducto[] = [
            {
              ...tipoProducto,
            },
            { id: 456 },
          ];
          expectedResult = service.addTipoProductoToCollectionIfMissing(tipoProductoCollection, tipoProducto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TipoProducto to an array that doesn't contain it", () => {
          const tipoProducto: ITipoProducto = { id: 123 };
          const tipoProductoCollection: ITipoProducto[] = [{ id: 456 }];
          expectedResult = service.addTipoProductoToCollectionIfMissing(tipoProductoCollection, tipoProducto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tipoProducto);
        });

        it('should add only unique TipoProducto to an array', () => {
          const tipoProductoArray: ITipoProducto[] = [{ id: 123 }, { id: 456 }, { id: 94048 }];
          const tipoProductoCollection: ITipoProducto[] = [{ id: 123 }];
          expectedResult = service.addTipoProductoToCollectionIfMissing(tipoProductoCollection, ...tipoProductoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tipoProducto: ITipoProducto = { id: 123 };
          const tipoProducto2: ITipoProducto = { id: 456 };
          expectedResult = service.addTipoProductoToCollectionIfMissing([], tipoProducto, tipoProducto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tipoProducto);
          expect(expectedResult).toContain(tipoProducto2);
        });

        it('should accept null and undefined values', () => {
          const tipoProducto: ITipoProducto = { id: 123 };
          expectedResult = service.addTipoProductoToCollectionIfMissing([], null, tipoProducto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tipoProducto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
