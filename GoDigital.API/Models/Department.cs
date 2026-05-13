namespace GoDigital.API.Models;

public class Department
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
