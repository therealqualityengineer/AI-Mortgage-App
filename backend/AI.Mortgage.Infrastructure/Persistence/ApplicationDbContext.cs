using AI.Mortgage.Domain.Entities;
using AI.Mortgage.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace AI.Mortgage.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();
    public DbSet<IdentityUser> IdentityUsers => Set<IdentityUser>();
    public DbSet<IdentityRole> IdentityRoles => Set<IdentityRole>();
    public DbSet<IdentityUserRole> IdentityUserRoles => Set<IdentityUserRole>();
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EntityName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.UserId).HasMaxLength(100);
            entity.Property(e => e.Details).HasMaxLength(4000);
        });

        modelBuilder.Entity<IdentityUser>(entity =>
        {
            entity.ToTable("users", "identity");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100).HasColumnName("username");
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(512).HasColumnName("password_hash");
            entity.Property(e => e.Email).HasMaxLength(256).HasColumnName("email");
            entity.Property(e => e.FullName).HasMaxLength(200).HasColumnName("full_name");
            entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(e => e.Username).IsUnique().HasDatabaseName("ix_users_username");
            entity.HasIndex(e => e.Email).HasDatabaseName("ix_users_email");
        });

        modelBuilder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable("roles", "identity");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100).HasColumnName("name");
            entity.Property(e => e.Description).HasMaxLength(500).HasColumnName("description");
            entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(e => e.Name).IsUnique().HasDatabaseName("ix_roles_name");
        });

        modelBuilder.Entity<IdentityUserRole>(entity =>
        {
            entity.ToTable("user_roles", "identity");
            entity.HasKey(e => new { e.UserId, e.RoleId });
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasIndex(e => e.UserId).HasDatabaseName("ix_user_roles_user_id");
            entity.HasIndex(e => e.RoleId).HasDatabaseName("ix_user_roles_role_id");

            entity.HasOne<IdentityUser>()
                .WithMany()
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne<IdentityRole>()
                .WithMany()
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("customers", "customer");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();

            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100).HasColumnName("first_name");
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100).HasColumnName("last_name");
            entity.Property(e => e.Email).HasMaxLength(256).HasColumnName("email");
            entity.Property(e => e.Phone).HasMaxLength(32).HasColumnName("phone");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");

            entity.Property(e => e.AddressLine1).HasMaxLength(200).HasColumnName("address_line1");
            entity.Property(e => e.AddressLine2).HasMaxLength(200).HasColumnName("address_line2");
            entity.Property(e => e.City).HasMaxLength(100).HasColumnName("city");
            entity.Property(e => e.State).HasMaxLength(100).HasColumnName("state");
            entity.Property(e => e.PostalCode).HasMaxLength(20).HasColumnName("postal_code");
            entity.Property(e => e.Country).HasMaxLength(100).HasColumnName("country").HasDefaultValue("US");

            entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(e => e.Email).HasDatabaseName("ix_customers_email");
            entity.HasIndex(e => new { e.LastName, e.FirstName }).HasDatabaseName("ix_customers_name");
        });

        base.OnModelCreating(modelBuilder);
    }
}
