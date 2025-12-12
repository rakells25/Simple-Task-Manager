import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Lista completa de tareas y lista filtrada según estado/prioridad/orden
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  // Filtros actuales
  statusFilter: 'all' | 'toDo' | 'inProgress' | 'done' = 'all';
  priorityFilter: 'all' | 'low' | 'medium' | 'high' = 'all';
  sortBy: 'createdAt' | 'dueDate' = 'createdAt';

  // Control del modal para crear/editar tareas
  showModal = false;
  modalTask: Task | null = null;

  // Contadores de tareas por estado
  counts = { total: 0, toDo: 0, inProgress: 0, done: 0 };

  // Opciones de filtro de estado
  statusOptions: Array<{
    label: string;
    value: 'all' | 'toDo' | 'inProgress' | 'done';
    count: number;
  }> = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Suscribirse al observable de tareas para actualizar lista en tiempo real
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks.map((t) => ({ ...t, status: t.status ?? 'toDo' }));
      this.applyFilters();
    });
  }

  // Aplica filtros de estado y prioridad, y ordena según 'sortBy'
  applyFilters(): void {
    this.filteredTasks = this.tasks
      .filter((t) => (this.statusFilter === 'all' ? true : t.status === this.statusFilter))
      .filter((t) => (this.priorityFilter === 'all' ? true : t.priority === this.priorityFilter))
      .sort((a, b) => {
        const aDate = a[this.sortBy] ? new Date(a[this.sortBy] || '').getTime() : 0;
        const bDate = b[this.sortBy] ? new Date(b[this.sortBy] || '').getTime() : 0;
        return this.sortBy === 'createdAt' ? bDate - aDate : aDate - bDate;
      });

    this.updateCounts();
    this.updateStatusOptions();
  }

  // Actualiza los contadores de tareas por estado
  updateCounts(): void {
    this.counts = {
      total: this.tasks.length,
      toDo: this.tasks.filter((t) => t.status === 'toDo').length,
      inProgress: this.tasks.filter((t) => t.status === 'inProgress').length,
      done: this.tasks.filter((t) => t.status === 'done').length,
    };
  }

  // Actualiza las opciones de filtro de estado con los contadores
  updateStatusOptions(): void {
    this.statusOptions = [
      { label: 'Total tareas', value: 'all', count: this.counts.total },
      { label: 'Pendientes', value: 'toDo', count: this.counts.toDo },
      { label: 'En progreso', value: 'inProgress', count: this.counts.inProgress },
      { label: 'Completadas', value: 'done', count: this.counts.done },
    ];
  }

  // Cambia el filtro de estado y reaplica filtros
  setStatusFilter(value: 'all' | 'toDo' | 'inProgress' | 'done'): void {
    this.statusFilter = value;
    this.applyFilters();
  }

  // Abre el modal, opcionalmente con una tarea existente para editar
  openModal(task?: Task): void {
    this.modalTask = task ?? null;
    this.showModal = true;
  }

  // Cierra el modal
  closeModal(): void {
    this.showModal = false;
    this.modalTask = null;
  }

  // Maneja la acción de guardar tarea (crear o actualizar)
  handleSave(task: Partial<Task> & { id?: number }): void {
    let request$;
    if (task.id != null) {
      // Actualizar tarea existente
      request$ = this.taskService.updateTask(task.id, task);
    } else {
      // Crear nueva tarea
      request$ = this.taskService.createTask(task);
    }

    // Suscribirse a la petición para recargar lista y cerrar modal
    request$.subscribe({
      next: () => {
        this.taskService.loadTasks(); // Forzar recarga
        this.closeModal(); // Cerrar modal
      },
      error: (err) => console.error('Error guardando tarea', err),
    });
  }

  // Alterna el estado de la tarea (done / toDo)
  handleToggle(id: number): void {
    this.taskService.toggleTask(id).subscribe(() => this.taskService.loadTasks());
  }

  // Elimina una tarea y recarga la lista
  handleDelete(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      console.log('Eliminado correctamente');
      this.taskService.loadTasks();
    });
  }
}