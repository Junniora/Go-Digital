using GoDigital.API.Models.Enums;

namespace GoDigital.API.DTOs;

public class CreateRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CurrentProcess { get; set; } = string.Empty;
    public string Problem { get; set; } = string.Empty;
    public string ExpectedImpact { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    
    public int UserId { get; set; }
    public int DepartmentId { get; set; }
}
