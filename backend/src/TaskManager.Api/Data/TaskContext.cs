using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data
{
    // Puente entre C# y la base de datos
    public class TaskContext : DbContext
    {
        // Constructor que recibe la configuración
        public TaskContext(DbContextOptions<TaskContext> options)
            : base(options) { }

        // Tabla Tasks en la base de datos
        public DbSet<TaskItem> Tasks { get; set; }
    }
}
