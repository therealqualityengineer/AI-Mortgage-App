using AI.Mortgage.Domain.Common;

namespace AI.Mortgage.Domain.Entities;

public class AuditLogEntry : BaseEntity
{
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? Details { get; set; }
}
