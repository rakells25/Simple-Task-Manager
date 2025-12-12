import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Partial<Task> & { id?: number }>();
  @Output() close = new EventEmitter<void>();

  form = {
    title: '',
    description: '',
    status: 'toDo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: null as string | null
  };

  saving = false;   // Cuando se está enviando
  saved = false;    // Cuando se ha guardado

  ngOnInit() {
    if (this.task) {
      this.form = {
        title: this.task.title,
        description: this.task.description ?? '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate ?? null
      };
    }
  }

  handleSubmit() {
    if (!this.form.title.trim()) return;
    this.saving = true;

    this.save.emit({
      id: this.task?.id,
      ...this.form,
      dueDate: this.form.dueDate || undefined
    });

    // Mostrar check y bloquear botón
    this.saved = true;
    this.saving = false;

    // Cerrar modal tras 1 segundo
    setTimeout(() => {
      this.close.emit();
      this.saved = false; // Reset para la próxima vez que abra el modal
    }, 1000);
  }
}
