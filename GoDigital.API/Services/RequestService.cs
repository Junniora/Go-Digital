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
            .Include(r => r.StatusHistory)
                .ThenInclude(h => h.FromStatus)
            .Include(r => r.StatusHistory)
                .ThenInclude(h => h.ToStatus)
            .Include(r => r.StatusHistory)
                .ThenInclude(h => h.ChangedByUser)
            .Include(r => r.Attachments)
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
            UpdatedAt = r.UpdatedAt,
            UserName = r.User?.Name ?? string.Empty,
            Status = r.Status != null ? new StatusDto { Id = r.Status.Id, Name = r.Status.Name } : null,
            Department = r.Department != null ? new DepartmentDto { Id = r.Department.Id, Name = r.Department.Name } : null,
            Comments = r.Comments.OrderBy(c => c.CreatedAt).Select(c => new RequestCommentDto
            {
                Id = c.Id,
                Comment = c.Comment,
                CreatedAt = c.CreatedAt,
                UserName = c.User?.Name ?? string.Empty
            }).ToList(),
            History = r.StatusHistory.OrderBy(h => h.CreatedAt).Select(h => new RequestStatusHistoryDto
            {
                Id = h.Id,
                Action = "status_changed",
                Description = h.FromStatus != null
                    ? $"Estado: {h.FromStatus.Name} \u2192 {h.ToStatus?.Name}"
                    : $"Estado inicial: {h.ToStatus?.Name}",
                User = h.ChangedByUser?.Name ?? string.Empty,
                CreatedAt = h.CreatedAt.ToString("o")
            }).ToList(),
            Attachments = r.Attachments.OrderBy(a => a.CreatedAt).Select(a => new AttachmentDto
            {
                Id = a.Id,
                Name = a.FileName,
                Url = a.FilePath,
                Size = a.FileSize,
                Type = a.ContentType
            }).ToList()
        };
    }

    public async Task<RequestDto> CreateAsync(CreateRequestDto dto)
    {
        var now = DateTime.UtcNow;
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
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        // Record initial status history
        _context.RequestStatusHistories.Add(new RequestStatusHistory
        {
            RequestId = request.Id,
            FromStatusId = null,
            ToStatusId = 1,
            ChangedByUserId = dto.UserId,
            CreatedAt = now
        });
        await _context.SaveChangesAsync();

        return await GetByIdAsync(request.Id) ?? throw new Exception("Error retrieving created request.");
    }

    public async Task<bool> UpdateStatusAsync(int id, UpdateStatusDto dto)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request == null) return false;

        var previousStatusId = request.StatusId;
        request.StatusId = dto.StatusId;
        request.UpdatedAt = DateTime.UtcNow;

        // Record history entry
        _context.RequestStatusHistories.Add(new RequestStatusHistory
        {
            RequestId = id,
            FromStatusId = previousStatusId,
            ToStatusId = dto.StatusId,
            ChangedByUserId = dto.ChangedByUserId,
            CreatedAt = DateTime.UtcNow
        });

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

    public async Task<List<AttachmentDto>> UploadAttachmentsAsync(int requestId, IList<IFormFile> files, string baseUrl)
    {
        var request = await _context.Requests.FindAsync(requestId)
            ?? throw new KeyNotFoundException("Request not found");

        // Ensure upload directory exists
        var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", requestId.ToString());
        Directory.CreateDirectory(uploadDir);

        var result = new List<AttachmentDto>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            // Generate a unique filename to avoid collisions
            var ext = Path.GetExtension(file.FileName);
            var uniqueName = $"{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(uploadDir, uniqueName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Store relative URL so the frontend can download it
            var relativeUrl = $"{baseUrl}/uploads/{requestId}/{uniqueName}";

            var attachment = new Attachment
            {
                RequestId = requestId,
                FileName = file.FileName,
                FilePath = relativeUrl,
                ContentType = file.ContentType,
                FileSize = file.Length,
                CreatedAt = DateTime.UtcNow
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            result.Add(new AttachmentDto
            {
                Id = attachment.Id,
                Name = attachment.FileName,
                Url = attachment.FilePath,
                Size = attachment.FileSize,
                Type = attachment.ContentType
            });
        }

        return result;
    }
}