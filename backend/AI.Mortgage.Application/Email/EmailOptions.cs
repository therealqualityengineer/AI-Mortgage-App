namespace AI.Mortgage.Application.Email;

/// <summary>
/// Strongly-typed options for SMTP email configuration.
/// Read from the "Email:Smtp" section in appsettings.json.
/// </summary>
public sealed class EmailOptions
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromEmail { get; set; } = "no-reply@aimortgage.local";
    public string FromName { get; set; } = "AI Mortgage Platform";
}
