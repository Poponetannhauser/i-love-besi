using Microsoft.AspNetCore.Mvc;

namespace ILoveBesi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetStatus()
        {
            return Ok(new
            {
                Status = "Healthy",
                Service = "ILoveBesi ASP.NET Core API",
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
