import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // URL base de la API
  private baseUrl = 'http://localhost:5065/api/Tasks';

  // BehaviorSubject para mantener y emitir el estado actual de la lista de tareas
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // Observable público para que otros componentes se suscriban
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar tareas iniciales al crear el servicio
    this.loadTasks();
  }

  // Getter para obtener la lista de tareas actual de manera síncrona
  get tasksSnapshot(): Task[] {
    return this.tasksSubject.value;
  }

  // GET
  // Carga todas las tareas desde la API y normaliza el estado
  loadTasks(): void {
    this.http.get<Task[]>(this.baseUrl).subscribe((tasks) => {
      const normalized = tasks.map((t) => ({
        ...t,
        status: t.status ?? 'toDo', // Asignar estado por defecto si es null
      }));
      this.tasksSubject.next(normalized);
    });
  }

  // POST
  // Crear una nueva tarea
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap((newTask) => {
        // Actualizar la lista local con la nueva tarea
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      })
    );
  }

  // PUT
  // Actualizar una tarea existente
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap((updated) => {
        // Reemplazar la tarea actualizada en la lista
        const updatedList = this.tasksSubject.value.map((t) => (t.id === id ? updated : t));
        this.tasksSubject.next(updatedList);
      })
    );
  }

  // DELETE
  // Eliminar una tarea
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadTasks()) // Recargar lista tras eliminar
    );
  }

  // PATCH
  // Alternar estado de una tarea entre "toDo" y "done"
  toggleTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/toggle`, {}).pipe(
      tap((updated) => {
        // Reemplazar la tarea actualizada en la lista
        const updatedList = this.tasksSubject.value.map((t) => (t.id === id ? updated : t));
        this.tasksSubject.next(updatedList);
      })
    );
  }
}