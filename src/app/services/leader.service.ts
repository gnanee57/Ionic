import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable , of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPmsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPmsgService: ProcessHTTPmsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders')
    .pipe(catchError(this.processHTTPmsgService.handleError));
  }
  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leaders/' + id)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true').pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }
}
