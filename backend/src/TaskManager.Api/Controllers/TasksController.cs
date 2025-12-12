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

        public TasksController(TaskContext context)
        {
            _context = context;
        }

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return tasks.Select(Map).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(TaskEntity task)
        {
            task.CreatedAt = DateTime.UtcNow;

            if (task.Status == null)
                task.Status = "toDo";

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(Map(task));
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // NEW /toggle
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