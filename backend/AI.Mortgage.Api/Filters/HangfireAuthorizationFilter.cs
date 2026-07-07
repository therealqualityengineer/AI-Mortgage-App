using Hangfire;
using Hangfire.AspNetCore;
using Hangfire.Dashboard;

namespace AI.Mortgage.Api.Filters;

/// <summary>
/// Restricts Hangfire Dashboard access to users with the "Admin" role.
/// Works with the existing JWT Bearer authentication.
/// </summary>
public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = (context as AspNetCoreDashboardContext)?.HttpContext;

        if (httpContext?.User?.Identity?.IsAuthenticated != true)
        {
            return false;
        }

        return httpContext.User.IsInRole("Admin");
    }
}
