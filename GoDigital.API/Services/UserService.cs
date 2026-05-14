using GoDigital.API.Data;
using GoDigital.API.DTOs;
using GoDigital.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GoDigital.API.Services;

public class UserService : IUserService
{
    private readonly GoDigitalDbContext _context;

    public UserService(GoDigitalDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.Department)
            .OrderBy(u => u.Name)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Department = u.Department != null ? u.Department.Name : string.Empty,
                DepartmentId = u.DepartmentId
            })
            .ToListAsync();
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        // Verify email is not already taken
        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists)
            throw new InvalidOperationException($"El email '{dto.Email}' ya está registrado.");

        // Verify department exists
        var department = await _context.Departments.FindAsync(dto.DepartmentId)
            ?? throw new KeyNotFoundException("Departamento no encontrado.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            DepartmentId = dto.DepartmentId
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Department = department.Name,
            DepartmentId = user.DepartmentId
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}
