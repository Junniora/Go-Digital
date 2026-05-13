using FluentValidation;
using GoDigital.API.DTOs;

namespace GoDigital.API.Validators;

public class UpdateStatusDtoValidator : AbstractValidator<UpdateStatusDto>
{
    public UpdateStatusDtoValidator()
    {
        RuleFor(x => x.StatusId)
            .GreaterThan(0).WithMessage("StatusId must be greater than 0.");
    }
}
