namespace GoDigital.API.Models;

public class Attachment
{
    public int Id { get; set; }
    
    public int RequestId { get; set; }
    public Request? Request { get; set; }

    public required string FileName { get; set; }
    public required string FilePath { get; set; }
    public DateTime CreatedAt { get; set; }
}
