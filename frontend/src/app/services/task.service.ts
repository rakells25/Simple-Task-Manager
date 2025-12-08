import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable, map } from 'rxjs';

interface TaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  isCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:5065/api/Tasks';

  constructor(private http: HttpClient) {}

  private mapTask(task: any): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      status: task.isCompleted ? 'done' : 'toDo',
      priority: task.priority ?? 'medium',
      createdAt: task.createdAt ?? '',
      dueDate: task.dueDate ?? ''
    };
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(map(tasks => tasks.map(t => this.mapTask(t))));
  }

  createTask(payload: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const body: TaskPayload = {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      priority: payload.priority,
      isCompleted: payload.status === 'done'
    };
    return this.http.post<any>(this.baseUrl, body)
      .pipe(map(t => this.mapTask(t)));
  }

  updateTask(id: number, payload: Partial<Task>): Observable<Task> {
    const body: TaskPayload = {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      priority: payload.priority,
      isCompleted: payload.status === 'done'
    };
    return this.http.put<any>(`${this.baseUrl}/${id}`, body)
      .pipe(map(t => this.mapTask(t)));
  }

  deleteTask(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  toggleTask(id: number): Observable<Task> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/toggle`, {})
      .pipe(map(t => this.mapTask(t)));
  }
}
