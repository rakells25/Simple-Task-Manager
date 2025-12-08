import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Partial<Task> & { id?: number }>();
  @Output() close = new EventEmitter<void>();

  form: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  } = {
    title: '',
    description: '',
    status: 'toDo',
    priority: 'medium',
    dueDate: ''
  };

  ngOnInit() {
    if (this.task) {
      this.form = {
        title: this.task.title ?? '',
        description: this.task.description ?? '',
        status: this.task.status ?? 'toDo',
        priority: this.task.priority ?? 'medium',
        dueDate: this.task.dueDate ?? ''
      };
    }
  }

  handleSubmit() {
    if (this.form.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(this.form.dueDate);
      if (selected < today) {
        alert('La fecha de vencimiento no puede ser anterior a hoy.');
        return;
      }
    }

    this.save.emit({
      id: this.task?.id,
      title: this.form.title,
      description: this.form.description,
      status: this.form.status,
      priority: this.form.priority,
      dueDate: this.form.dueDate || undefined
    });
  }
}
