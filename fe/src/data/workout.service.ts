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

  logger = effect(() => {
    console.log(this.workouts());
  });

  getWorkoutTypes(): string[] {
    return this.workouts().map((workout) => <string>workout.type);
  }

  async addWorkout(workout: Workout): Promise<void> {
    console.log(this.workouts());
    const workouts = [...this.workouts(), workout];

    this.workouts.set(workouts);
    console.log(this.workouts());
    await this.saveWorkouts();
  }

  async saveWorkouts(): Promise<void> {
    await this.dataService.save(this.workouts());
  }
}
