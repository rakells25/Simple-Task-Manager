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

  // Estado local del formulario
  form = {
    title: '',
    description: '',
    status: 'toDo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: null as string | null,
  };

  saving = false;
  saved = false;

  // Inicializar formulario si se recibe una tarea para editar
  ngOnInit() {
    if (this.task) {
      this.form = {
        title: this.task.title,
        description: this.task.description ?? '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate ?? null,
      };
    }
  }

  // Maneja el envío del formulario
  handleSubmit() {
    if (!this.form.title.trim()) return; // Validación mínima: título no vacío
    this.saving = true;

    // Emitir evento para guardar tarea
    this.save.emit({
      id: this.task?.id,
      ...this.form,
      dueDate: this.form.dueDate || undefined,
    });

    // Mostrar check de guardado
    this.saved = true;
    this.saving = false;

    // Cerrar modal tras 1 segundo
    setTimeout(() => {
      this.close.emit();
      this.saved = false;
    }, 1000);
  }
}