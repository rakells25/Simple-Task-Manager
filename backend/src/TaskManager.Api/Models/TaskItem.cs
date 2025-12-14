using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models
{
    public class TaskEntity
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Status { get; set; }

        [Required]
        public string Priority { get; set; } = "medium";

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
