using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ILoveBesi.Api.Models.Entities
{
    public class RebarItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LedgerId { get; set; }

        [ForeignKey("LedgerId")]
        public CalculationLedger? Ledger { get; set; }

        public double DiameterMm { get; set; }

        public double LengthMeters { get; set; }

        public int Quantity { get; set; }

        public double CalculatedWeightKg { get; set; }

        [MaxLength(50)]
        public string StructuralCategory { get; set; } = "Balok"; // Balok, Kolom, Sengkang, Sloof
    }
}
