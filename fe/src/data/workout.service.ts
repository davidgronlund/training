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
