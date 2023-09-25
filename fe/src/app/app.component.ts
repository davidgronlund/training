import {
  Component,
  computed,
  effect,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
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
      <section class="workout pt-5">
        <form (ngSubmit)="save()" #workoutForm="ngForm">
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
              placeholder="Ny typ av träning"
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
        </form>
      </section>
      <div class="mt-6">
        <div
          *ngFor="let workoutPerYear of workoutService.groupWorkoutsPerYear()"
        >
          <div class="workout-per-year" *ngIf="workoutPerYear">
            <span class="has-text-weight-bold"
              >År {{ workoutPerYear.year }}</span
            >
            <div>Antal pass: {{ workoutPerYear.workouts.length }}</div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <div
          class=""
          *ngFor="let workoutPerWeek of workoutService.groupWorkoutsPerWeek()"
        >
          <div class="workout-per-week" *ngIf="workoutPerWeek">
            <span class="has-text-weight-bold"
              >Vecka {{ workoutPerWeek.week }}: {{ workoutPerWeek.year }}</span
            >
            <div>Antal pass: {{ workoutPerWeek.workouts.length }}</div>
            <div>
              Total tid:
              {{ workoutService.getTotalDuration(workoutPerWeek.workouts) }}
            </div>
          </div>
        </div>
      </div>

      <div class="table-container mt-6">
        <table class="table">
          <thead>
            <tr>
              <th>Typ</th>
              <th>
                <button class="has-text-link-dark" (click)="orderBy('date')">
                  Datum
                </button>
              </th>
              <th>
                <button
                  class="has-text-link-dark"
                  (click)="orderBy('duration')"
                >
                  Tid
                </button>
              </th>
              <th>Kommentar</th>
              <th>Ändra</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let workout of workouts()">
              <td>{{ workout.type }}</td>
              <td>{{ workout.date }}</td>
              <td>{{ workout.duration }} min</td>
              <td>{{ workout.comment }}</td>
              <td>
                <div class="is-flex-wrap-nowrap">
                  <button
                    class="button button-change fa fa-pencil"
                    (click)="editWorkout(workout)"
                  >
                    Redigera
                  </button>
                  <button
                    class="button button-change fa fa-trash"
                    (click)="workoutService.removeWorkout(workout)"
                  >
                    Ta bort
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  emptyWorkout: Workout = {
    date: new Date(),
    duration: undefined,
    id: 0,
    type: '',
  };
  workout: Workout = this.emptyWorkout;
  previousPosition: number = 0;

  workouts: WritableSignal<Workout[]> = signal([]);

  update = effect(
    () => {
      this.workoutService.workouts();

      this.workouts.set(this.workoutService.workouts());
    },
    { allowSignalWrites: true }
  );
  constructor(public workoutService: WorkoutService) {}

  async save() {
    if (this.workout.id) {
      await this.workoutService.editWorkout(this.workout);
      window.scrollTo(0, this.previousPosition);
    } else {
      await this.workoutService.addWorkout(this.workout);
    }

    this.clear();
  }

  clear(): void {
    this.workout = this.emptyWorkout;
  }

  async ngOnInit(): Promise<void> {
    const workouts = await this.workoutService.loadWorkouts();
    this.workouts.set(workouts);
    this.orderBy('date');
  }

  editWorkout(workout: Workout): void {
    this.workout = workout;
    this.previousPosition = window.scrollY;
    window.scrollTo(0, 0);
  }

  currentSort = { type: '', descending: false };

  orderBy(type: string) {
    const workouts = this.workouts();
    console.log(workouts);
    if (type === 'date') {
      if (this.currentSort.type === 'date' && !this.currentSort.descending) {
        workouts.sort(this.workoutService.byDate);
      } else {
        workouts.sort(this.workoutService.byDateDescending);
      }
      this.currentSort = {
        type: 'date',
        descending: !this.currentSort.descending,
      };
    } else if (type === 'duration') {
      if (
        this.currentSort.type === 'duration' &&
        !this.currentSort.descending
      ) {
        workouts.sort(this.workoutService.byDuration);
      } else {
        workouts.sort(this.workoutService.byDurationDescending);
      }
      this.currentSort = {
        type: 'duration',
        descending: !this.currentSort.descending,
      };
    }

    console.log(workouts);

    this.workouts.set(workouts);
  }
}
