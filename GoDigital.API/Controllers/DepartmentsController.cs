using GoDigital.API.DTOs;
using GoDigital.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GoDigital.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public DepartmentsController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
    {
        var departments = await _catalogService.GetDepartmentsAsync();
        return Ok(departments);
    }
}
