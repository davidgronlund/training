import {
  Injectable,
  signal,
  WritableSignal,
  effect,
  Signal,
  computed,
} from '@angular/core';
import { DataService } from './data.service';
import { Workout } from '../models/workout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(private dataService: DataService) {}

  workouts: WritableSignal<Workout[]> = signal([]);

  async loadWorkouts(): Promise<Workout[]> {
    const workouts = await this.dataService.load();
    this.workouts.set(workouts);
    return this.workouts();
  }

  async addWorkout(workout: Workout) {
    workout.id = this.workouts().length + 1;
    const workouts = [...this.workouts(), workout];
    this.workouts.set(workouts);

    await this.saveWorkouts(workouts);
  }

  async removeWorkout(workout: Workout) {
    const workouts = this.workouts().filter((w) => w !== workout);
    this.workouts.set(workouts);

    await this.saveWorkouts(workouts);
  }

  async editWorkout(workout: Workout) {
    this.workouts.mutate((workouts) => {
      workouts[workouts.indexOf(workout)] = workout;
    });

    await this.saveWorkouts(this.workouts());
  }

  saveWorkouts(workouts: Workout[]) {
    return this.dataService.save(workouts);
  }

  orderByDuration() {
    this.workouts().sort(this.byDuration);
  }

  getWeek(date: Date): number {
    // if type of date is not Date
    date = this.convertToDate(date);

    date = new Date(date.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  convertToDate(possibleDate: any): Date {
    if (typeof possibleDate !== 'object') {
      possibleDate = new Date(possibleDate);
    }

    return possibleDate;
  }

  groupWorkoutsPerWeek(): WorkoutsPerWeek[] {
    const workoutsPerWeek: WorkoutsPerWeek[] = [];
    const workouts = this.workouts().sort(this.byDateDescending);

    workouts.forEach((workout) => {
      const week = this.getWeek(workout.date);
      if (workoutsPerWeek[week]) {
        workoutsPerWeek[week].workouts.push(workout);
      } else {
        const date = this.convertToDate(workout.date);
        workoutsPerWeek[week] = {
          workouts: [workout],
          week: week,
          year: date.getFullYear(),
        };
      }
    });

    console.log(workoutsPerWeek);

    return workoutsPerWeek;
  }

  getTotalDuration(workouts: Workout[]): number {
    if (workouts.length === 0) {
      return 0;
    }

    return workouts
      .filter((workout) => workout.duration)
      .reduce((acc, workout) => acc + <number>workout.duration, 0);
  }

  byDuration(a: Workout, b: Workout) {
    if (a.duration && b.duration) {
      return a.duration - b.duration;
    }

    return 0;
  }

  byDurationDescending(a: Workout, b: Workout) {
    if (a.duration && b.duration) {
      return b.duration - a.duration;
    }
    return 0;
  }

  byDate(a: Workout, b: Workout) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

  byDateDescending(a: Workout, b: Workout) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
}

interface WorkoutsPerWeek {
  workouts: Workout[];
  week: number;
  year?: number;
}
