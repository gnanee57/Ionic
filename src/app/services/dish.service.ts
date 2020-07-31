import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable , of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPmsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient,
    private processHTTPmsgService: ProcessHTTPmsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + 'dishes')
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)));
  }
}