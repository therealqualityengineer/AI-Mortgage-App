using AI.Mortgage.Application.Services;

namespace AI.Mortgage.Api.Tests;

public class AuthServiceTests
{
    [Fact]
    public void Hash_ProducesSecureHash_NotPlaintext()
    {
        var hash = PasswordVerifier.Hash("secret123");

        Assert.NotNull(hash);
        Assert.NotEqual("secret123", hash);
        Assert.True(hash.Length > 20);
    }

    [Fact]
    public void Verify_ReturnsTrue_ForCorrectPassword()
    {
        var hash = PasswordVerifier.Hash("P@ssw0rd!");
        var result = PasswordVerifier.Verify("P@ssw0rd!", hash);

        Assert.True(result);
    }

    [Fact]
    public void Verify_ReturnsFalse_ForIncorrectPassword()
    {
        var hash = PasswordVerifier.Hash("correct-password");
        var result = PasswordVerifier.Verify("wrong-password", hash);

        Assert.False(result);
    }

    [Fact]
    public void Verify_ReturnsFalse_ForEmptyInputs()
    {
        Assert.False(PasswordVerifier.Verify("", "somehash"));
        Assert.False(PasswordVerifier.Verify("password", ""));
        Assert.False(PasswordVerifier.Verify(null!, null));
    }
}
