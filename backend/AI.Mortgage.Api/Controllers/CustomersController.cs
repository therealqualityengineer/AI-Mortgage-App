using AI.Mortgage.Application.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI.Mortgage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _customerService.GetAllAsync(cancellationToken);
        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Error });
        }
        return Ok(new { success = true, data = result.Value });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _customerService.GetByIdAsync(id, cancellationToken);
        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Error });
        }
        if (result.Value is null)
        {
            return NotFound(new { success = false, message = "Customer not found" });
        }
        return Ok(new { success = true, data = result.Value });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var result = await _customerService.CreateAsync(request, cancellationToken);
        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Error });
        }
        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, new { success = true, data = result.Value });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var result = await _customerService.UpdateAsync(id, request, cancellationToken);
        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Error });
        }
        if (result.Value is null)
        {
            return NotFound(new { success = false, message = "Customer not found" });
        }
        return Ok(new { success = true, data = result.Value });
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> SetStatus(Guid id, [FromBody] SetStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await _customerService.SetActiveStatusAsync(id, request.IsActive, cancellationToken);
        if (!result.IsSuccess)
        {
            return BadRequest(new { success = false, message = result.Error });
        }
        return Ok(new { success = true });
    }
}

public sealed class SetStatusRequest
{
    public bool IsActive { get; set; }
}
