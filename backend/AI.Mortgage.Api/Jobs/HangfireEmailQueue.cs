using AI.Mortgage.Application.Email;
using Hangfire;

namespace AI.Mortgage.Api.Jobs;

/// <summary>
/// Hangfire-based implementation of IEmailQueue.
/// Enqueues the EmailJob for background execution.
/// </summary>
public class HangfireEmailQueue : IEmailQueue
{
    public void EnqueueWelcomeEmail(string customerName, string toEmail)
    {
        BackgroundJob.Enqueue<EmailJob>(job => job.SendWelcomeEmailAsync(customerName, toEmail));
    }
}
