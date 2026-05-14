using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GoDigital.API.Data;
using GoDigital.API.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GoDigital.API.Services;

public class AuthService : IAuthService
{
    private readonly GoDigitalDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(GoDigitalDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        var token = GenerateJwt(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new AuthUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Department = user.Department?.Name ?? string.Empty,
                Role = user.Role
            }
        };
    }

    private string GenerateJwt(GoDigital.API.Models.User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
