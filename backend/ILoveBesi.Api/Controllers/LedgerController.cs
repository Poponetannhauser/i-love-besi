using System.Security.Claims;
using System.Text.Json;
using ILoveBesi.Api.Data;
using ILoveBesi.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ILoveBesi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LedgerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LedgerController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserLedgers()
        {
            var userId = GetUserId();
            var ledgers = await _context.CalculationLedgers
                .Include(l => l.RebarItems)
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(ledgers);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLedger([FromBody] CalculationLedger ledger)
        {
            var userId = GetUserId();
            if (userId == 0) return Unauthorized();

            ledger.UserId = userId;
            ledger.CreatedAt = DateTime.UtcNow;

            _context.CalculationLedgers.Add(ledger);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserLedgers), new { id = ledger.Id }, ledger);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteLedger(int id)
        {
            var ledger = await _context.CalculationLedgers.FindAsync(id);
            if (ledger == null) return NotFound();

            _context.CalculationLedgers.Remove(ledger);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Ledger {id} successfully deleted by Admin." });
        }
    }
}
