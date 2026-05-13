using GoDigital.API.Data;
using GoDigital.API.DTOs;
using GoDigital.API.Models;
using GoDigital.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GoDigital.API.Services;

public class RequestService : IRequestService
{
    private readonly GoDigitalDbContext _context;

    public RequestService(GoDigitalDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RequestDto>> GetAllAsync(int? statusId, int? departmentId, Priority? priority)
    {
        var query = _context.Requests
            .Include(r => r.Status)
            .Include(r => r.Department)
            .Include(r => r.User)
            .AsQueryable();

        if (statusId.HasValue)
        {
            query = query.Where(r => r.StatusId == statusId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(r => r.DepartmentId == departmentId.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(r => r.Priority == priority.Value);
        }

        var requests = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        return requests.Select(r => new RequestDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            CurrentProcess = r.CurrentProcess,
            Problem = r.Problem,
            ExpectedImpact = r.ExpectedImpact,
            Priority = r.Priority.ToString(),
            CreatedAt = r.CreatedAt,
            UserName = r.User?.Name ?? string.Empty,
            Status = r.Status != null ? new StatusDto { Id = r.Status.Id, Name = r.Status.Name } : null,
            Department = r.Department != null ? new DepartmentDto { Id = r.Department.Id, Name = r.Department.Name } : null
        });
    }

    public async Task<RequestDto?> GetByIdAsync(int id)
    {
        var r = await _context.Requests
            .Include(r => r.Status)
            .Include(r => r.Department)
            .Include(r => r.User)
            .Include(r => r.Comments)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (r == null) return null;

        return new RequestDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            CurrentProcess = r.CurrentProcess,
            Problem = r.Problem,
            ExpectedImpact = r.ExpectedImpact,
            Priority = r.Priority.ToString(),
            CreatedAt = r.CreatedAt,
            UserName = r.User?.Name ?? string.Empty,
            Status = r.Status != null ? new StatusDto { Id = r.Status.Id, Name = r.Status.Name } : null,
            Department = r.Department != null ? new DepartmentDto { Id = r.Department.Id, Name = r.Department.Name } : null,
            Comments = r.Comments.OrderBy(c => c.CreatedAt).Select(c => new RequestCommentDto
            {
                Id = c.Id,
                Comment = c.Comment,
                CreatedAt = c.CreatedAt,
                UserName = c.User?.Name ?? string.Empty
            }).ToList()
        };
    }

    public async Task<RequestDto> CreateAsync(CreateRequestDto dto)
    {
        var request = new Request
        {
            Title = dto.Title,
            Description = dto.Description,
            CurrentProcess = dto.CurrentProcess,
            Problem = dto.Problem,
            ExpectedImpact = dto.ExpectedImpact,
            Priority = dto.Priority,
            UserId = dto.UserId,
            DepartmentId = dto.DepartmentId,
            StatusId = 1, // Nuevo
            CreatedAt = DateTime.UtcNow
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(request.Id) ?? throw new Exception("Error retrieving created request.");
    }

    public async Task<bool> UpdateStatusAsync(int id, UpdateStatusDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return false;

        request.StatusId = dto.StatusId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RequestCommentDto> AddCommentAsync(int id, CreateCommentDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) throw new KeyNotFoundException("Request not found");

        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null) throw new KeyNotFoundException("User not found");

        var comment = new RequestComment
        {
            RequestId = id,
            UserId = dto.UserId,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.RequestComments.Add(comment);
        await _context.SaveChangesAsync();

        return new RequestCommentDto
        {
            Id = comment.Id,
            Comment = comment.Comment,
            CreatedAt = comment.CreatedAt,
            UserName = user.Name
        };
    }
}