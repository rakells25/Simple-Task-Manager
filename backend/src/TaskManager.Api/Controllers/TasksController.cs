using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskContext _context;

        // Inyección del contexto de base de datos
        public TasksController(TaskContext context)
        {
            _context = context;
        }

        // Mapea una entidad de base de datos a un DTO que se devuelve al cliente
        private static TaskDto Map(TaskEntity t)
        {
            return new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                DueDate = t.DueDate
            };
        }

        // GET
        // Devuelve todas las tareas almacenadas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return tasks.Select(Map).ToList();
        }

        // POST
        // Crea una nueva tarea y la guarda en la base de datos
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(TaskEntity task)
        {
            task.CreatedAt = DateTime.UtcNow;

            // Si no se especifica estado, se asigna "toDo" por defecto
            if (task.Status == null)
                task.Status = "toDo";

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(Map(task));
        }

        // PUT
        // Actualiza una tarea existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskEntity updated)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updated.Title;
            task.Description = updated.Description;
            task.Status = updated.Status;
            task.Priority = updated.Priority;
            task.DueDate = updated.DueDate;

            await _context.SaveChangesAsync();

            return Ok(Map(task));
        }

        // DELETE
        // Elimina una tarea por ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH
        // Alterna el estado entre "done" y "toDo"
        [HttpPatch("{id}/toggle")]
        public async Task<ActionResult<TaskDto>> ToggleTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Status = task.Status == "done" ? "toDo" : "done";

            await _context.SaveChangesAsync();

            return Ok(Map(task));
        }
    }
}