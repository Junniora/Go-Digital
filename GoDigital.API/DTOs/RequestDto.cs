using GoDigital.API.Models.Enums;

namespace GoDigital.API.DTOs;

public class RequestDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CurrentProcess { get; set; } = string.Empty;
    public string Problem { get; set; } = string.Empty;
    public string ExpectedImpact { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public StatusDto? Status { get; set; }
    public DepartmentDto? Department { get; set; }
    
    // Simplification for user display
    public string UserName { get; set; } = string.Empty;
    
    // Comments
    public List<RequestCommentDto> Comments { get; set; } = new();

    // Status change history
    public List<RequestStatusHistoryDto> History { get; set; } = new();

    // Attachments
    public List<AttachmentDto> Attachments { get; set; } = new();
}