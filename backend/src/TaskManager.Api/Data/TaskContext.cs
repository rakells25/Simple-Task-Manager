using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data
{
    public class TaskContext : DbContext
    {
        // Constructor que recibe las opciones de configuración del contexto
        public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }

        // Representa la tabla de tareas en la base de datos
        // Permite realizar consultas y operaciones CRUD sobre TaskEntity
        public DbSet<TaskEntity> Tasks => Set<TaskEntity>();
    }
}