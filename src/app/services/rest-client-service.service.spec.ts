import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RestClientServiceService } from './rest-client-service.service';

describe('RestClientServiceService', () => {
  let service: RestClientServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestClientServiceService]
    });
    service = TestBed.inject(RestClientServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDrugs', () => {
    it('should send a GET request to the correct endpoint', () => {
      service.getDrugs().subscribe();
      const req = httpTestingController.expectOne('http://localhost:5000/drugs');
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('getDrugDetails', () => {
    it('should send a GET request to the correct endpoint with the provided drug ID', () => {
      const drugId = 1;
      service.getDrugDetails(drugId).subscribe();
      const req = httpTestingController.expectOne(`http://localhost:5000/drug/${drugId}`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('login', () => {
    it('should send a POST request to the correct endpoint with the provided email and password', () => {
      const email = 'test@example.com';
      const password = 'password';
      service.login(email, password).subscribe();
      const req = httpTestingController.expectOne('http://localhost:5000/login');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ email, password });
    });
  });

  describe('register', () => {
    it('should send a POST request to the correct endpoint with the provided user object', () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      service.register(user).subscribe();
      const req = httpTestingController.expectOne('http://localhost:5000/register');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(user);
    });
  });

  describe('makeOrder', () => {
    it('should send a POST request to the correct endpoint with the provided body and headers', () => {
      const body = { drugId: 1, quantity: 2 };
      const headers = { Authorization: 'Bearer token' };
      service.makeOrder(body, headers).subscribe();
      const req = httpTestingController.expectOne('http://localhost:5000/order');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(body);
      expect(req.request.headers.get('Authorization')).toEqual('Bearer token');
    });
  });
});