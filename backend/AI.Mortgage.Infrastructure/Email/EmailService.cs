using System.Net;
using System.Net.Mail;
using AI.Mortgage.Application.Email;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AI.Mortgage.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailOptions> options, ILogger<EmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendWelcomeEmailAsync(string customerName, string toEmail, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            _logger.LogWarning("Welcome email skipped: no email address for customer {CustomerName}", customerName);
            return;
        }

        var subject = "Welcome to AI Mortgage Platform";
        var body = $@"Hi {customerName},

Welcome to AI Mortgage Platform.

Your customer profile has been successfully created.

We are delighted to have you with us.

Regards,
AI Mortgage Team";

        try
        {
            using var client = new SmtpClient(_options.Host, _options.Port)
            {
                EnableSsl = _options.EnableSsl,
                Credentials = new NetworkCredential(_options.Username, _options.Password),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            using var message = new MailMessage
            {
                From = new MailAddress(_options.FromEmail, _options.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            message.To.Add(toEmail);

            await client.SendMailAsync(message, cancellationToken);

            _logger.LogInformation("Welcome email sent to {ToEmail} for customer {CustomerName}", toEmail, customerName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send welcome email to {ToEmail} for customer {CustomerName}", toEmail, customerName);
            throw; // Let Hangfire retry
        }
    }
}
