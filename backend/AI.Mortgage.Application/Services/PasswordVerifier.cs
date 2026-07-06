using Microsoft.AspNetCore.Identity;

namespace AI.Mortgage.Application.Services;

public static class PasswordVerifier
{
    private static readonly PasswordHasher<object> _hasher = new();

    public static string Hash(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty", nameof(password));

        return _hasher.HashPassword(null!, password);
    }

    public static bool Verify(string password, string? storedPassword)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(storedPassword))
        {
            return false;
        }

        var result = _hasher.VerifyHashedPassword(null!, storedPassword, password);
        return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}
