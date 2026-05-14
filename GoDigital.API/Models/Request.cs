using GoDigital.API.Models.Enums;

namespace GoDigital.API.Models;

public class Request
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string CurrentProcess { get; set; }
    public required string Problem { get; set; }
    public required string ExpectedImpact { get; set; }
    
    public Priority Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public int StatusId { get; set; }
    public RequestStatus? Status { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int DepartmentId { get; set; }
    public Department? Department { get; set; }

    public ICollection<RequestComment> Comments { get; set; } = new List<RequestComment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<RequestStatusHistory> StatusHistory { get; set; } = new List<RequestStatusHistory>();
}