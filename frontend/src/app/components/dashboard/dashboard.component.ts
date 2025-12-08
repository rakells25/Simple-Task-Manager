import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  counts = { total: 0, toDo: 0, inProgress: 0, done: 0 };

  sortBy: 'createdAt' | 'dueDate' = 'createdAt';
  statusFilter: TaskStatus | 'all' = 'all';
  priorityFilter: TaskPriority | 'all' = 'all';

  showModal = false;
  modalTask: Task | null = null;

  // Array tipado para filtros de estado
  statusFilters: { label: string; value: TaskStatus | 'all'; count: number }[] = [];

  constructor(private taskService: TaskService) {
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
      this.updateStatusFilters();
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks
      .filter(t => this.statusFilter === 'all' ? true : t.status === this.statusFilter)
      .filter(t => this.priorityFilter === 'all' ? true : t.priority === this.priorityFilter)
      .sort((a, b) => {
        const dateA = a[this.sortBy] ? new Date(a[this.sortBy]!) : new Date(0);
        const dateB = b[this.sortBy] ? new Date(b[this.sortBy]!) : new Date(0);
        return this.sortBy === 'createdAt'
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });

    this.counts = {
      total: this.tasks.length,
      toDo: this.tasks.filter(t => t.status === 'toDo').length,
      inProgress: this.tasks.filter(t => t.status === 'inProgress').length,
      done: this.tasks.filter(t => t.status === 'done').length
    };

    this.updateStatusFilters();
  }

  updateStatusFilters() {
    this.statusFilters = [
      { label: 'Total tareas', value: 'all', count: this.counts.total },
      { label: 'Pendientes', value: 'toDo', count: this.counts.toDo },
      { label: 'En progreso', value: 'inProgress', count: this.counts.inProgress },
      { label: 'Completadas', value: 'done', count: this.counts.done }
    ];
  }

  setStatusFilter(value: TaskStatus | 'all') {
    this.statusFilter = value;
    this.applyFilters();
  }

  openModal(task?: Task) {
    this.modalTask = task ?? null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalTask = null;
  }

  handleSave(task: Partial<Task> & { id?: number }) {
    if (task.id != null) {
      this.taskService.updateTask(task.id, task).subscribe(() => this.fetchTasks());
    } else {
      this.taskService.createTask(task as Omit<Task, 'id' | 'createdAt'>).subscribe(() => this.fetchTasks());
    }
    this.closeModal();
  }

  handleToggle(id: number) {
    this.taskService.toggleTask(id).subscribe(() => this.fetchTasks());
  }

  handleDelete(id: number) {
    if (confirm('¿Eliminar tarea?')) {
      this.taskService.deleteTask(id).subscribe(() => this.fetchTasks());
    }
  }
}
