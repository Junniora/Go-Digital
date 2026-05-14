namespace GoDigital.API.Models;

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; // user | dx_team | admin

    public int DepartmentId { get; set; }
    public Department? Department { get; set; }

    public ICollection<Request> Requests { get; set; } = new List<Request>();
    public ICollection<RequestComment> Comments { get; set; } = new List<RequestComment>();
}
