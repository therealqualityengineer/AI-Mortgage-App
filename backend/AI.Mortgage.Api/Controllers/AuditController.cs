using Microsoft.AspNetCore.Mvc;

namespace AI.Mortgage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ready" });
}
