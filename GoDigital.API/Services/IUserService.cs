using GoDigital.API.DTOs;

namespace GoDigital.API.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<bool> DeleteAsync(int id);
}
