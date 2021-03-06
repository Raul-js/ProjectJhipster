jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICompra, Compra } from '../compra.model';
import { CompraService } from '../service/compra.service';

import { CompraRoutingResolveService } from './compra-routing-resolve.service';

describe('Service Tests', () => {
  describe('Compra routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CompraRoutingResolveService;
    let service: CompraService;
    let resultCompra: ICompra | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CompraRoutingResolveService);
      service = TestBed.inject(CompraService);
      resultCompra = undefined;
    });

    describe('resolve', () => {
      it('should return ICompra returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCompra = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCompra).toEqual({ id: 123 });
      });

      it('should return new ICompra if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCompra = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCompra).toEqual(new Compra());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCompra = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCompra).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
