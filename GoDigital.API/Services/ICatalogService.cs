using GoDigital.API.DTOs;

namespace GoDigital.API.Services;

public interface ICatalogService
{
    Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync();
    Task<IEnumerable<StatusDto>> GetStatusesAsync();
}
