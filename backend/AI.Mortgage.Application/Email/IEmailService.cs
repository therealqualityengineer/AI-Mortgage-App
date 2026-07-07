using System.Threading;
using System.Threading.Tasks;

namespace AI.Mortgage.Application.Email;

public interface IEmailService
{
    /// <summary>
    /// Sends the standard welcome email for a newly created customer.
    /// </summary>
    Task SendWelcomeEmailAsync(string customerName, string toEmail, CancellationToken cancellationToken = default);

    // Designed to be extended for future notification types:
    // Task SendLoanApprovalEmailAsync(...);
    // Task SendPasswordResetEmailAsync(...);
    // Task SendEmiReminderEmailAsync(...);
    // Task SendDocumentRequestEmailAsync(...);
    // Task SendLoanRejectionEmailAsync(...);
}
