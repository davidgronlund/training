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

  workoutsSource = computed(() => {
    const workouts = this.orderBy('date');

    this.workouts.set(workouts);

    return this.workouts();
  });

  logger = effect(async () => {
    const workouts = this.workouts();
    console.log(workouts);
  });

  async loadWorkouts(): Promise<void> {
    const workouts = await this.dataService.load();

    // order by date
    workouts.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    this.workouts.set(workouts);
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

  orderBy(type: string) {
    const workouts = this.workouts();
    if (type === 'date') {
      workouts.sort(this.byDate);
    } else {
      workouts.sort(this.byDuration);
    }

    return workouts;
  }

  orderByDuration() {
    this.workouts().sort(this.byDuration);
  }

  byDuration(a: Workout, b: Workout) {
    return a.duration - b.duration;
  }

  byDate(a: Workout, b: Workout) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }
}
