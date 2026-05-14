namespace GoDigital.API.DTOs;

public class RequestStatusHistoryDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;       // "created" | "status_changed"
    public string Description { get; set; } = string.Empty;
    public string User { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}
