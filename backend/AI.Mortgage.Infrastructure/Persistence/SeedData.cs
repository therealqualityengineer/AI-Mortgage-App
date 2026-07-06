using AI.Mortgage.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;

namespace AI.Mortgage.Infrastructure.Persistence;

/// <summary>
/// Startup data seeder for the identity schema.
/// Runs only if the target records do not already exist (idempotent).
/// </summary>
public static class SeedData
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Idempotency: do not reseed if the specific Admin user already exists
        if (context.IdentityUsers.Any(u => u.Username == "arunqa"))
        {
            return;
        }

        var hasher = new PasswordHasher<object>();

        // Create or ensure Admin role
        var adminRole = context.IdentityRoles.FirstOrDefault(r => r.Name == "Admin");
        if (adminRole is null)
        {
            adminRole = new IdentityRole
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                Description = "Full system access",
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow
            };
            context.IdentityRoles.Add(adminRole);
        }

        // Hash password using the same mechanism as runtime (PBKDF2 via PasswordHasher<T>)
        var passwordHash = hasher.HashPassword(null!, "Varshini@99");

        var adminUser = new IdentityUser
        {
            Id = Guid.NewGuid(),
            Username = "arunqa",
            PasswordHash = passwordHash,
            Email = "therealqualityengineer@gmail.com",
            FullName = "System Administrator",
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow
        };

        context.IdentityUsers.Add(adminUser);

        // Assign role (only if the link does not exist)
        var linkExists = context.IdentityUserRoles.Any(ur =>
            ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id);

        if (!linkExists)
        {
            context.IdentityUserRoles.Add(new IdentityUserRole
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            });
        }

        context.SaveChanges();
    }
}
