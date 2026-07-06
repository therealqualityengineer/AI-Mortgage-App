using AI.Mortgage.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace AI.Mortgage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    private readonly HealthCheckService _healthCheckService;

    public AuditController(HealthCheckService healthCheckService)
    {
        _healthCheckService = healthCheckService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(new { status = _healthCheckService.GetStatus() });
}
