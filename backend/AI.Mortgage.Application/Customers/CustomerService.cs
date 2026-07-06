using AI.Mortgage.Application.Common;
using AI.Mortgage.Application.Customers;
using AI.Mortgage.Application.Repositories;
using AI.Mortgage.Domain.Entities;

namespace AI.Mortgage.Application.Customers;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IReadOnlyList<CustomerDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var customers = await _repository.GetAllAsync(cancellationToken);
        var dtos = customers.Select(MapToDto).ToList();
        return Result<IReadOnlyList<CustomerDto>>.Success(dtos);
    }

    public async Task<Result<CustomerDto?>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _repository.GetByIdAsync(id, cancellationToken);
        return customer is null
            ? Result<CustomerDto?>.Success(null)
            : Result<CustomerDto?>.Success(MapToDto(customer));
    }

    public async Task<Result<CustomerDto>> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
        {
            return Result<CustomerDto>.Failure("First name and last name are required.");
        }

        var entity = new Customer
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            DateOfBirth = request.DateOfBirth,
            AddressLine1 = string.IsNullOrWhiteSpace(request.AddressLine1) ? null : request.AddressLine1.Trim(),
            AddressLine2 = string.IsNullOrWhiteSpace(request.AddressLine2) ? null : request.AddressLine2.Trim(),
            City = string.IsNullOrWhiteSpace(request.City) ? null : request.City.Trim(),
            State = string.IsNullOrWhiteSpace(request.State) ? null : request.State.Trim(),
            PostalCode = string.IsNullOrWhiteSpace(request.PostalCode) ? null : request.PostalCode.Trim(),
            Country = string.IsNullOrWhiteSpace(request.Country) ? "US" : request.Country.Trim(),
            IsActive = true
        };

        var created = await _repository.AddAsync(entity, cancellationToken);
        return Result<CustomerDto>.Success(MapToDto(created));
    }

    public async Task<Result<CustomerDto?>> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return Result<CustomerDto?>.Success(null);
        }

        if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
        {
            return Result<CustomerDto?>.Failure("First name and last name are required.");
        }

        existing.FirstName = request.FirstName.Trim();
        existing.LastName = request.LastName.Trim();
        existing.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        existing.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        existing.DateOfBirth = request.DateOfBirth;
        existing.AddressLine1 = string.IsNullOrWhiteSpace(request.AddressLine1) ? null : request.AddressLine1.Trim();
        existing.AddressLine2 = string.IsNullOrWhiteSpace(request.AddressLine2) ? null : request.AddressLine2.Trim();
        existing.City = string.IsNullOrWhiteSpace(request.City) ? null : request.City.Trim();
        existing.State = string.IsNullOrWhiteSpace(request.State) ? null : request.State.Trim();
        existing.PostalCode = string.IsNullOrWhiteSpace(request.PostalCode) ? null : request.PostalCode.Trim();
        existing.Country = string.IsNullOrWhiteSpace(request.Country) ? "US" : request.Country.Trim();

        if (request.IsActive.HasValue)
        {
            existing.IsActive = request.IsActive.Value;
        }

        await _repository.UpdateAsync(existing, cancellationToken);
        return Result<CustomerDto?>.Success(MapToDto(existing));
    }

    public async Task<Result<bool>> SetActiveStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return Result<bool>.Failure("Customer not found.");
        }

        existing.IsActive = isActive;
        await _repository.UpdateAsync(existing, cancellationToken);
        return Result<bool>.Success(true);
    }

    private static CustomerDto MapToDto(Customer c) => new(
        c.Id,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        c.DateOfBirth,
        c.AddressLine1,
        c.AddressLine2,
        c.City,
        c.State,
        c.PostalCode,
        c.Country,
        c.IsActive,
        c.CreatedAt,
        c.UpdatedAt
    );
}
