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
    const json: string = JSON.stringify(workouts);
    const blob: Blob = new Blob([json], {
      type: 'application/json',
    });

    // fetch

    await fetch(`${this.apiUrl}/workouts`, {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'application/json',
      }
    });

/*    this.http.post(`${this.apiUrl}/workouts`, blob);*/
  }

  async load(): Promise<Workout[]> {
    const response: Response = await fetch(`${this.apiUrl}/workouts`);
    const json = await response.json();
    console.log(json);
    return json as Workout[];
  }
}
