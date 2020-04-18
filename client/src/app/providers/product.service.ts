import { Injectable } from '@angular/core';
import { AppConfig } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class ProductService {
  private url = AppConfig.serverURL + 'product';
  constructor(
    public http: HttpClient
  ) { }
  public getAllProducts(): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(this.url).
      pipe(map((res: any) => res.products));
  }
  public setProducts(file: File): Observable<Array<Product>> {
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post(this.url, formData).
      pipe(map((res: any) => res.products));
  }
}
