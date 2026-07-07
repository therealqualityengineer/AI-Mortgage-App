using AI.Mortgage.Domain.Entities;
using AI.Mortgage.Application.Repositories;
using AI.Mortgage.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI.Mortgage.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CustomerRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Customer>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Customers
            .AsNoTracking()
            .OrderBy(c => c.LastName)
            .ThenBy(c => c.FirstName)
            .ToListAsync(cancellationToken);
    }

    public async Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        var normalized = email.Trim().ToLowerInvariant();
        return await _dbContext.Customers
            .AsNoTracking()
            .AnyAsync(c => c.Email != null && c.Email.ToLower() == normalized, cancellationToken);
    }

    public async Task<bool> ExistsByPhoneAsync(string phone, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(phone)) return false;
        var normalized = System.Text.RegularExpressions.Regex.Replace(phone, @"\D", "");
        if (string.IsNullOrEmpty(normalized)) return false;

        var existingPhones = await _dbContext.Customers
            .AsNoTracking()
            .Where(c => c.Phone != null)
            .Select(c => c.Phone)
            .ToListAsync(cancellationToken);

        return existingPhones.Any(p =>
            System.Text.RegularExpressions.Regex.Replace(p!, @"\D", "") == normalized);
    }

    public async Task<Customer> AddAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        customer.CreatedAt = DateTimeOffset.UtcNow;

        _dbContext.Customers.Add(customer);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return customer;
    }

    public async Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        _dbContext.Customers.Attach(customer);
        _dbContext.Entry(customer).State = EntityState.Modified;
        customer.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
