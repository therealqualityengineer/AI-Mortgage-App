namespace AI.Mortgage.Application.Email;

/// <summary>
/// Abstraction for enqueuing background email jobs.
/// Keeps the Application layer decoupled from Hangfire.
/// </summary>
public interface IEmailQueue
{
    /// <summary>
    /// Enqueues a welcome email to be sent in the background.
    /// </summary>
    void EnqueueWelcomeEmail(string customerName, string toEmail);
}
