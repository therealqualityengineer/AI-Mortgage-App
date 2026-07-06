using AI.Mortgage.Application.Common;
using AI.Mortgage.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _dbContext;

    public AuthService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<AuthenticatedUser>> AuthenticateAsync(
        string username,
        string password,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            return Result<AuthenticatedUser>.Failure("Invalid username or password.");
        }

        var user = await _dbContext.IdentityUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);

        if (user is null || !user.IsActive)
        {
            return Result<AuthenticatedUser>.Failure("Invalid username or password.");
        }

        var passwordMatches = PasswordVerifier.Verify(password, user.PasswordHash);
        if (!passwordMatches)
        {
            return Result<AuthenticatedUser>.Failure("Invalid username or password.");
        }

        var roleNames = await (
            from ur in _dbContext.IdentityUserRoles
            join r in _dbContext.IdentityRoles on ur.RoleId equals r.Id
            where ur.UserId == user.Id
            select r.Name
        ).AsNoTracking().ToListAsync(cancellationToken);

        var authenticatedUser = new AuthenticatedUser(
            user.Username,
            user.Email,
            user.FullName,
            roleNames);

        return Result<AuthenticatedUser>.Success(authenticatedUser);
    }
}
