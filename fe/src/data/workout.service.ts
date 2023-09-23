import {
  Injectable,
  signal,
  WritableSignal,
  effect,
  Signal,
} from '@angular/core';
import { DataService } from './data.service';
import { Workout } from '../models/workout';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(private dataService: DataService) {}

  workouts: Signal<Workout[]> = toSignal(this.dataService.load(), {
    initialValue: [],
  });

  save = toSignal(this.dataService.save())

  logger = effect(() => {
    console.log(this.workouts());
  });

  getWorkoutTypes(): string[] {
    return this.workouts().map((workout) => <string>workout.type);
  }

  addWorkout(workout: Workout) {
    const workouts = [...this.workouts(), workout];

    return this.saveWorkouts(workouts);
  }

  saveWorkouts(workouts: Workout[]) {
    return this.dataService.save(workouts);
  }
}
