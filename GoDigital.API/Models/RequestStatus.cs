namespace GoDigital.API.Models;

public class RequestStatus
{
    public int Id { get; set; }
    public required string Name { get; set; } // Nuevo, En revisión DX, En backlog, En desarrollo, En pruebas, Entregado, Cerrado

    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
