using System.ComponentModel.DataAnnotations;

namespace GoDigital.API.DTOs;

public class CreateUserDto
{
    [Required]
    public required string Name { get; set; }

    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required, MinLength(6)]
    public required string Password { get; set; }

    [Required]
    public required string Role { get; set; } // user | dx_team | admin

    [Required]
    public int DepartmentId { get; set; }
}
