import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  expanded = false;
  confirmDelete = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  confirmDeleteTask() {
    this.confirmDelete = true;
    setTimeout(() => this.confirmDelete = false, 3000);
  }

  onConfirmDelete(event: Event) {
    event.stopPropagation();
    this.confirmDeleteTask();
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onToggle(event: Event) {
    event.stopPropagation();
    this.toggle.emit(this.task.id);
  }

  onDelete(event: Event) {
  event.stopPropagation();
  this.delete.emit(this.task.id!);
}

  // ✅ Getter para estilos según prioridad
  get styles() {
    switch (this.task.priority) {
      case 'high':
        return { border: 'border-red-600', bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-600' };
      case 'medium':
        return { border: 'border-amber-600', bg: 'bg-amber-50', hover: 'hover:bg-amber-100', text: 'text-amber-600' };
      case 'low':
        return { border: 'border-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100', text: 'text-blue-600' };
      default:
        return { border: 'border-gray-300', bg: 'bg-gray-100', hover: '', text: 'text-gray-700' };
    }
  }
}
