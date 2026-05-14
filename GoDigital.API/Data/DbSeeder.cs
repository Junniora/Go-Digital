using GoDigital.API.Data;
using Microsoft.EntityFrameworkCore;

namespace GoDigital.API.Data;

/// <summary>
/// Crea los usuarios iniciales con contraseñas hasheadas en la base de datos
/// si todavía no existen. Se ejecuta una sola vez al arrancar la aplicación.
/// </summary>
public static class DbSeeder
{
    private record SeedUser(string Name, string Email, string Password, string Role, int DepartmentId);

    private static readonly SeedUser[] Users =
    [
        new("Admin User", "admin@godigital.com", "admin123", "admin",   3),
        new("DX Team",    "dx@godigital.com",    "dx123",    "dx_team", 3),
        new("John Doe",   "user@godigital.com",  "user123",  "user",    1),
    ];

    public static async Task SeedAsync(GoDigitalDbContext context)
    {
        foreach (var seed in Users)
        {
            // Solo insertar si el email no existe ya
            var exists = await context.Users.AnyAsync(u => u.Email == seed.Email);
            if (!exists)
            {
                context.Users.Add(new GoDigital.API.Models.User
                {
                    Name         = seed.Name,
                    Email        = seed.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(seed.Password),
                    Role         = seed.Role,
                    DepartmentId = seed.DepartmentId
                });
                await context.SaveChangesAsync(); // guardar uno a la vez para evitar conflictos
            }
            else
            {
                // Reparar hash vacío o inválido, y rol incorrecto
                var user = await context.Users.FirstAsync(u => u.Email == seed.Email);
                bool changed = false;

                if (string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(seed.Password);
                    changed = true;
                }

                if (user.Role != seed.Role)
                {
                    user.Role = seed.Role;
                    changed = true;
                }

                if (changed) await context.SaveChangesAsync();
            }
        }
    }
}

