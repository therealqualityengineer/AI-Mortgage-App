using AI.Mortgage.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace AI.Mortgage.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;

    public AuthController(
        IConfiguration configuration,
        IAuthService authService,
        ITokenService tokenService)
    {
        _configuration = configuration;
        _authService = authService;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.AuthenticateAsync(request.Username, request.Password, cancellationToken);

        if (result.IsSuccess && result.Value is not null)
        {
            var user = result.Value;
            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                success = true,
                message = "Login successful",
                token,
                user = new { username = user.Username, roles = user.Roles }
            });
        }

        return Unauthorized(new { success = false, message = "Invalid username or password." });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var username = User.Identity?.Name ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        var roles = User.Claims
            .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        return Ok(new
        {
            success = true,
            user = new { username, roles }
        });
    }

    [HttpGet("schema")]
    public async Task<IActionResult> GetSchemaAsync([FromQuery] string schemaName = "identity", CancellationToken cancellationToken = default)
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return BadRequest(new { success = false, message = "No connection string configured." });
        }

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        var schemasQuery = """
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
            ORDER BY schema_name;
            """;

        var tablesQuery = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = @schemaName
            ORDER BY table_name;
            """;

        await using var schemaCommand = new NpgsqlCommand(schemasQuery, connection);
        await using var schemaReader = await schemaCommand.ExecuteReaderAsync(cancellationToken);

        var schemas = new List<string>();
        while (await schemaReader.ReadAsync(cancellationToken))
        {
            schemas.Add(schemaReader.GetString(0));
        }

        await using var tableCommand = new NpgsqlCommand(tablesQuery, connection);
        tableCommand.Parameters.AddWithValue("schemaName", schemaName);
        await using var tableReader = await tableCommand.ExecuteReaderAsync(cancellationToken);

        var tables = new List<string>();
        while (await tableReader.ReadAsync(cancellationToken))
        {
            tables.Add(tableReader.GetString(0));
        }

        return Ok(new
        {
            success = true,
            database = connection.Database,
            schema = schemaName,
            schemas,
            tables
        });
    }
}

public sealed class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
