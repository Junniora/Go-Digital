using GoDigital.API.DTOs;
using GoDigital.API.Models.Enums;

namespace GoDigital.API.Services;

public interface IRequestService
{
    Task<IEnumerable<RequestDto>> GetAllAsync(int? statusId, int? departmentId, Priority? priority);
    Task<RequestDto?> GetByIdAsync(int id);
    Task<RequestDto> CreateAsync(CreateRequestDto dto);
    Task<bool> UpdateStatusAsync(int id, UpdateStatusDto dto);
    Task<RequestCommentDto> AddCommentAsync(int id, CreateCommentDto dto);
}
