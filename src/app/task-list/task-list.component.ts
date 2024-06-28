import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms'; 
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    FormsModule 
  ],
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<MatTableDataSource<Task>>;
  displayedColumns: string[] = ['title', 'description', 'dueDate', 'priority', 'status', 'actions'];
  selectedStatus: 'completed' | 'pending' | 'all' = 'all';
  selectedPriority: 'low' | 'medium' | 'high' | 'all' = 'all';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.refreshTasks();
  }

  editTask(id: number): void {
    this.router.navigate(['/edit', id]);
    this.refreshTasks();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.refreshTasks();
  }

  completeTask(task: Task): void {
    const updatedTask = { ...task, completed: true };
    this.taskService.updateTask(updatedTask);
    this.refreshTasks();
  }

  filterTasks(status: 'completed' | 'pending' | 'all', priority: 'low' | 'medium' | 'high' | 'all') {
    const filteredTasks = this.taskService.filterTasks(status, priority);
    this.tasks$ = of(new MatTableDataSource(filteredTasks));
  }

  sortTasks(criteria: 'dueDate' | 'priority') {
    const sortedTasks = this.taskService.sortTasks(criteria);
    this.tasks$ = of(new MatTableDataSource(sortedTasks));
  }

  navigateToAddTask(): void {
    this.router.navigate(['/add']);
  }

  refreshTasks(): void {
    this.tasks$ = this.taskService.tasks$.pipe(
      map(tasks => new MatTableDataSource(tasks))
    );
  }
}