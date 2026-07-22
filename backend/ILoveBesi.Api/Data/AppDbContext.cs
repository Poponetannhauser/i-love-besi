using ILoveBesi.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ILoveBesi.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<CalculationLedger> CalculationLedgers => Set<CalculationLedger>();
        public DbSet<RebarItem> RebarItems => Set<RebarItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User -> Ledger (1-to-Many)
            modelBuilder.Entity<CalculationLedger>()
                .HasOne(l => l.User)
                .WithMany(u => u.Ledgers)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ledger -> RebarItem (1-to-Many)
            modelBuilder.Entity<RebarItem>()
                .HasOne(r => r.Ledger)
                .WithMany(l => l.RebarItems)
                .HasForeignKey(r => r.LedgerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
