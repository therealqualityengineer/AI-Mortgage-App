namespace AI.Mortgage.Application.Customers;

public sealed record CustomerDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    DateTime? DateOfBirth,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt
);

public sealed record CreateCustomerRequest(
    string FirstName,
    string LastName,
    string? Email = null,
    string? Phone = null,
    DateTime? DateOfBirth = null,
    string? AddressLine1 = null,
    string? AddressLine2 = null,
    string? City = null,
    string? State = null,
    string? PostalCode = null,
    string? Country = "US"
);

public sealed record UpdateCustomerRequest(
    string FirstName,
    string LastName,
    string? Email = null,
    string? Phone = null,
    DateTime? DateOfBirth = null,
    string? AddressLine1 = null,
    string? AddressLine2 = null,
    string? City = null,
    string? State = null,
    string? PostalCode = null,
    string? Country = "US",
    bool? IsActive = null
);
