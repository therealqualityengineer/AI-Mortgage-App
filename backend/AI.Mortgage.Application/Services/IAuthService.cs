using AI.Mortgage.Application.Common;

namespace AI.Mortgage.Application.Services;

public interface IAuthService
{
    Task<Result<AuthenticatedUser>> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);
}

public sealed record AuthenticatedUser(
    string Username,
    string? Email,
    string? FullName,
    IReadOnlyList<string> Roles);
