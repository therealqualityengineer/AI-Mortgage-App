using AI.Mortgage.Application.Email;
using Hangfire;

namespace AI.Mortgage.Api.Jobs;

public class EmailJob
{
    private readonly IEmailService _emailService;

    public EmailJob(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task SendWelcomeEmailAsync(string customerName, string toEmail)
    {
        await _emailService.SendWelcomeEmailAsync(customerName, toEmail);
    }
}
