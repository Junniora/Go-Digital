using GoDigital.API.Data;
using GoDigital.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GoDigital.API.Services;

public class CatalogService : ICatalogService
{
    private readonly GoDigitalDbContext _context;

    public CatalogService(GoDigitalDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync()
    {
        return await _context.Departments
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<StatusDto>> GetStatusesAsync()
    {
        return await _context.RequestStatuses
            .Select(s => new StatusDto
            {
                Id = s.Id,
                Name = s.Name
            })
            .ToListAsync();
    }
}
