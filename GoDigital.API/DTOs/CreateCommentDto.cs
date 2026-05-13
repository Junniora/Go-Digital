namespace GoDigital.API.DTOs;

public class CreateCommentDto
{
    public int UserId { get; set; }
    public string Comment { get; set; } = string.Empty;
}
