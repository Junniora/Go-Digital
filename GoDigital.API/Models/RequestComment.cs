namespace GoDigital.API.Models;

public class RequestComment
{
    public int Id { get; set; }
    
    public int RequestId { get; set; }
    public Request? Request { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public required string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
