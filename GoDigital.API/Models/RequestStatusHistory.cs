namespace GoDigital.API.Models;

public class RequestStatusHistory
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public Request? Request { get; set; }

    public int? FromStatusId { get; set; }
    public RequestStatus? FromStatus { get; set; }

    public int ToStatusId { get; set; }
    public RequestStatus? ToStatus { get; set; }

    public int ChangedByUserId { get; set; }
    public User? ChangedByUser { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
