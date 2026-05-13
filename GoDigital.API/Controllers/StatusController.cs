using GoDigital.API.DTOs;
using GoDigital.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoDigital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public StatusController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StatusDto>>> GetStatuses()
    {
        var statuses = await _catalogService.GetStatusesAsync();
        return Ok(statuses);
    }
}
