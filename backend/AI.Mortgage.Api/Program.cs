using System.Text;
using AI.Mortgage.Api.Filters;
using AI.Mortgage.Api.Jobs;
using AI.Mortgage.Api.Services;
using AI.Mortgage.Application.Customers;
using AI.Mortgage.Application.Email;
using AI.Mortgage.Application.Repositories;
using AI.Mortgage.Application.Services;
using AI.Mortgage.Infrastructure.Email;
using AI.Mortgage.Infrastructure.Persistence;
using AI.Mortgage.Infrastructure.Repositories;
using AI.Mortgage.Infrastructure.Services;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

// Customer Management (Sprint 3)
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
var jwtIssuer = jwtSection["Issuer"] ?? "AI.Mortgage";
var jwtAudience = jwtSection["Audience"] ?? "AI.Mortgage.Client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Hangfire (PostgreSQL storage) + Email (Sprint 3.1)
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("Email:Smtp"));
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailQueue, HangfireEmailQueue>();

if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddHangfire(config =>
        config.UsePostgreSqlStorage(connectionString));

    builder.Services.AddHangfireServer();
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed initial identity data on startup (idempotent).
// Only inserts if the 'arunqa' user does not already exist.
// This is the single place responsible for bootstrap admin user + Admin role.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    AI.Mortgage.Infrastructure.Persistence.SeedData.Initialize(dbContext);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

// Hangfire Dashboard - protected to Admin role only (Sprint 3.1)
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "ready" }))
    .WithName("HealthCheck")
    .WithOpenApi();

app.Run();
