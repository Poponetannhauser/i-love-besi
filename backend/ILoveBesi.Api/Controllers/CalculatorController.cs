using ILoveBesi.Api.Models.Dtos;
using ILoveBesi.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ILoveBesi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculatorController : ControllerBase
    {
        private readonly IRebarCalculatorService _calculatorService;
        private readonly ICuttingStockOptimizerService _optimizerService;

        public CalculatorController(
            IRebarCalculatorService calculatorService,
            ICuttingStockOptimizerService optimizerService)
        {
            _calculatorService = calculatorService;
            _optimizerService = optimizerService;
        }

        [HttpPost("weight")]
        public IActionResult CalculateWeight([FromBody] RebarCalculateRequestDto dto)
        {
            if (dto == null) return BadRequest(new { Message = "Calculation parameters required." });

            var weight = _calculatorService.CalculateWeightKg(dto.DiameterMm, dto.LengthMeters, dto.Quantity, dto.ToleranceFactor);
            var lapSplice = _calculatorService.CalculateLapSpliceMeters(dto.DiameterMm, dto.LapSpliceFactor);

            return Ok(new RebarCalculateResponseDto
            {
                DiameterMm = dto.DiameterMm,
                LengthMeters = dto.LengthMeters,
                Quantity = dto.Quantity,
                TotalWeightKg = weight,
                LapSpliceMeters = lapSplice
            });
        }

        [HttpPost("optimize-cutting")]
        public IActionResult OptimizeCutting([FromBody] List<CutRequestItemDto> items)
        {
            if (items == null || items.Count == 0) return BadRequest(new { Message = "Cut items required for optimization." });

            var result = _optimizerService.Optimize1DCuttingStock(items);
            return Ok(result);
        }
    }
}
