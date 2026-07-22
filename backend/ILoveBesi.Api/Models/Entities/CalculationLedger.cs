using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ILoveBesi.Api.Models.Entities
{
    public class CalculationLedger
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string ProjectName { get; set; } = string.Empty;

        public double TotalWeightKg { get; set; }

        public double WastePercentage { get; set; }

        public string? CuttingSchemeJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<RebarItem> RebarItems { get; set; } = new List<RebarItem>();
    }
}
