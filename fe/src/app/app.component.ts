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
            <div class="card-content">
              <h1 class="title">Träningslogg</h1>
              <div class="is-flex-direction-row">
                <div class="control">
                  <div class="select">
                    <select [(ngModel)]="workout.type" name="workoutTypeSelect">
                      <option>Välj typ av träning...</option>
                      <option *ngFor="let workout of workoutService.workouts()">
                        {{ workout.type }}
                      </option>
                    </select>
                  </div>
                </div>
                <input
                  required
                  name="workoutType"
                  class="input"
                  type="text"
                  placeholder="Typ av träning"
                  [(ngModel)]="workout.type"
                />
              </div>
              <input
                required
                name="workoutDate"
                class="input"
                type="date"
                placeholder="Datum"
                [(ngModel)]="workout.date"
              />
              <input
                required
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
              <button
                [disabled]="!workoutForm.form.valid"
                class="button"
                type="submit"
              >
                Spara
              </button>
              <div class="has-text-info-light" *ngIf="workoutForm.submitted">
                Sparat
              </div>
            </div>
          </section>
        </form>
      </section>
      <section class="card mt-6">
        <div class="card-content">
          <h1 class="title">Historik</h1>
          <div class="workouts">
            <div
              class="workout"
              *ngFor="let workout of workoutService.workouts()"
            >
              <div class="card mb-4">
                <div class="card-content">
                  <h1 class="subtitle">{{ workout.type }}</h1>
                  <p>{{ workout.date }}</p>
                  <p>{{ workout.duration }} min</p>
                  <p>{{ workout.comment }}</p>
                </div>
                <div class="card-footer">
                  <button
                    class="button"
                    (click)="workoutService.removeWorkout(workout)"
                  >
                    Ta bort
                  </button>
                  <button class="button" (click)="editWorkout(workout)">
                    Redigera
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  workout: Workout = {};

  previousPosition = 0;
  constructor(public workoutService: WorkoutService) {}

  async save() {
    if (this.workout.id) {
      await this.workoutService.editWorkout(this.workout);

      console.log(this.previousPosition);
      window.scrollTo(0, this.previousPosition);
    } else {
      await this.workoutService.addWorkout(this.workout);
    }

    this.clear();
  }

  clear() {
    this.workout = {};
  }

  async ngOnInit(): Promise<void> {
    await this.workoutService.loadWorkouts();
  }

  editWorkout(workout: Workout) {
    this.workout = workout;

    this.previousPosition = window.scrollY;
    console.log(this.previousPosition);

    // go to top
    window.scrollTo(0, 0);
  }
}
