import {
  Injectable,
  signal,
  WritableSignal,
  effect,
  Signal,
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

  logger = effect(async () => {
    const workouts = this.workouts();
    console.log(workouts);
  });

  async loadWorkouts(): Promise<void> {
    const workouts = await this.dataService.load();

    this.workouts.set(workouts);
  }

  getWorkoutTypes(): string[] {
    return this.workouts().map((workout) => <string>workout.type);
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
}
