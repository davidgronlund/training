import { Injectable, Signal } from '@angular/core';
import { Workout } from '../models/workout';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { environment } from '../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient],
})
export class DataService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  async save(workouts: Workout[]) {
    const json = JSON.stringify(workouts);
    const blob = new Blob([json], {
      type: 'application/json',
    });
    return this.http.post(`${this.apiUrl}/workouts`, blob);
  }

  load(): Observable<Workout[]> {
    return this.http
      .get<Workout[]>(`${this.apiUrl}/workouts`)
      .pipe(map((workouts) => workouts || []));
  }
}
