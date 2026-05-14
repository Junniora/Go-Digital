using GoDigital.API.DTOs;
using GoDigital.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GoDigital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Login con email y contraseña. Devuelve un JWT válido por 8 horas.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null)
            return Unauthorized(new { message = "Credenciales incorrectas." });

        return Ok(result);
    }
}
