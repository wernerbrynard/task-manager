import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasks.asObservable();

  private generateId(): number {
    return Math.floor(Math.random() * 100000);
  }

  addTask(task: Task) {
    const currentTasks = this.tasks.value;
    task.id = this.generateId();
    this.tasks.next([...currentTasks, task]);
  }

  updateTask(updatedTask: Task) {
    const currentTasks = this.tasks.value.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasks.next(currentTasks);
  }

  deleteTask(id: number) {
    const currentTasks = this.tasks.value.filter((task) => task.id !== id);
    this.tasks.next(currentTasks);
  }

  filterTasks(status: 'completed' | 'pending' | 'all', priority: 'low' | 'medium' | 'high' | 'all') {
    return this.tasks.value.filter(task => {
      return (status === 'all' || (status === 'completed' ? task.completed : !task.completed)) &&
             (priority === 'all' || task.priority === priority);
    });
  }

  sortTasks(criteria: 'dueDate' | 'priority') {
    return this.tasks.value.sort((a, b) => {
      if (criteria === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });
  }
}