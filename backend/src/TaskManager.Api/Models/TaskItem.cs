using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models
{
    // Representa una tarea en el sistema
    public class TaskItem
    {
        public int Id { get; set; }  // Identificador único

        // El título es obligatorio
        [Required(ErrorMessage = "El título es obligatorio")]
        [MaxLength(200)]
        public string Title { get; set; }

        // Descripción opcional
        public string Description { get; set; }

        // Indica si la tarea está completada
        public bool IsCompleted { get; set; } = false;

        // Fecha de creación automática
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
