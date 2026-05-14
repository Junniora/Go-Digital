using GoDigital.API.DTOs;

namespace GoDigital.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}
