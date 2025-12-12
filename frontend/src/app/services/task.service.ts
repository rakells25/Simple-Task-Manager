import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs'; 
import { Task, TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private baseUrl = 'http://localhost:5065/api/Tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  get tasksSnapshot(): Task[] {
  return this.tasksSubject.value;
}
  loadTasks(): void {
    this.http.get<Task[]>(this.baseUrl).subscribe(tasks => {
      const normalized = tasks.map(t => ({
        ...t,
        status: t.status ?? 'toDo'
      }));
      this.tasksSubject.next(normalized);
    });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(newTask => {
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      })
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap(updated => {
        const updatedList = this.tasksSubject.value.map(t =>
          t.id === id ? updated : t
        );
        this.tasksSubject.next(updatedList);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
    tap(() => this.loadTasks())
  );
}


  toggleTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/toggle`, {}).pipe(
      tap(updated => {
        const updatedList = this.tasksSubject.value.map(t =>
          t.id === id ? updated : t
        );
        this.tasksSubject.next(updatedList);
      })
    );
  }
}
