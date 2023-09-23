import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../data/workout.service';
import { FormsModule } from '@angular/forms';
import { Workout } from '../models/workout';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: [`./app.component.css`],
  template: `
    <main class="container is-fluid ">
      <section class="workout">
        <form (ngSubmit)="save()" #workoutForm="ngForm">
          <section class="card">
            <div class="card-header">
              <h1 class="title">Träningslogg</h1>
            </div>
            <div class="card-content">
              <input
                name="workoutType"
                class="input"
                type="text"
                placeholder="Träning"
                [(ngModel)]="workout.type"
              />
              <div class="control">
                <div class="select">
                  <select [(ngModel)]="workout.type" name="workoutTypeSelect">
                    <option>Välj...</option>
                    <option *ngFor="let workout of workoutService.workouts()">
                      {{ workout.type }}
                    </option>
                  </select>
                </div>
              </div>
              <!--
              <input  class="input" type="text" placeholder="Typ av träning" />
              -->
              <input
                name="workoutDate"
                class="input"
                type="date"
                placeholder="Datum"
                [(ngModel)]="workout.date"
              />
              <input
                name="workoutDuration"
                class="input"
                type="number"
                placeholder="Total tid (minuter)"
                [(ngModel)]="workout.duration"
              />
              <input
                name="workoutComment"
                class="textarea"
                type="text"
                placeholder="Kommentar"
                [(ngModel)]="workout.comment"
              />
              <button class="button" type="submit">Lägg till träning</button>
              <span class="has-text-danger" *ngIf="workoutForm.submitted"
                >Sparat</span
              >
            </div>
          </section>
        </form>
      </section>
    </main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  workouts: Workout[] = [];

  workout: Workout = {};

  constructor(public workoutService: WorkoutService) {}

  async save() {
    console.log(this.workout);
    await this.workoutService.addWorkout(this.workout);
  }

  clear() {
    this.workout = {};
  }

  async ngOnInit(): Promise<void> {
    await this.workoutService.loadWorkouts();
  }

  addWorkout($event: SubmitEvent) {
    console.log($event);
  }
}
