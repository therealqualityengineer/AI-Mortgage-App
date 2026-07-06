namespace AI.Mortgage.Infrastructure.Persistence.Entities;

public class AuditEntry
{
    public Guid Id { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? Details { get; set; }
}
