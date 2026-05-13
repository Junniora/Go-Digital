using GoDigital.API.DTOs;
using GoDigital.API.Models.Enums;
using GoDigital.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoDigital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController : ControllerBase
{
    private readonly IRequestService _requestService;

    public RequestsController(IRequestService requestService)
    {
        _requestService = requestService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequests(
        [FromQuery] int? statusId,
        [FromQuery] int? departmentId,
        [FromQuery] Priority? priority)
    {
        var requests = await _requestService.GetAllAsync(statusId, departmentId, priority);
        return Ok(requests);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RequestDto>> GetRequest(int id)
    {
        var request = await _requestService.GetByIdAsync(id);
        if (request == null)
            return NotFound();

        return Ok(request);
    }

    [HttpPost]
    public async Task<ActionResult<RequestDto>> CreateRequest([FromBody] CreateRequestDto dto)
    {
        var request = await _requestService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var success = await _requestService.UpdateStatusAsync(id, dto);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<RequestCommentDto>> AddComment(int id, [FromBody] CreateCommentDto dto)
    {
        try
        {
            var comment = await _requestService.AddCommentAsync(id, dto);
            return Ok(comment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
