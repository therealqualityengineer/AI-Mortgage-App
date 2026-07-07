using AI.Mortgage.Application.Common;
using AI.Mortgage.Application.Customers;

namespace AI.Mortgage.Application.Customers;

public interface ICustomerService
{
    Task<Result<IReadOnlyList<CustomerDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<CustomerDto?>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<CustomerDto>> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<Result<CustomerDto?>> UpdateAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<Result<bool>> SetActiveStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken = default);
}
