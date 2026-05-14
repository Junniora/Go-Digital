namespace GoDigital.API.Models;

public class Attachment
{
    public int Id { get; set; }

    public int RequestId { get; set; }
    public Request? Request { get; set; }

    public required string FileName { get; set; }    // Nombre original del archivo
    public required string FilePath { get; set; }    // Ruta en el servidor
    public required string ContentType { get; set; } // MIME type
    public long FileSize { get; set; }               // Bytes
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

