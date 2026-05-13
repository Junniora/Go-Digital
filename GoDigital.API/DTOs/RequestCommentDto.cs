namespace GoDigital.API.DTOs;

public class RequestCommentDto
{
    public int Id { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string UserName { get; set; } = string.Empty;
}
