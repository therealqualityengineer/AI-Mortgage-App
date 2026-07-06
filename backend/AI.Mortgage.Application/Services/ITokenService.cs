namespace AI.Mortgage.Application.Services;

public interface ITokenService
{
    string GenerateToken(AuthenticatedUser user);
}
