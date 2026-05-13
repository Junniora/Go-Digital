using FluentValidation;
using GoDigital.API.DTOs;

namespace GoDigital.API.Validators;

public class CreateRequestDtoValidator : AbstractValidator<CreateRequestDto>
{
    public CreateRequestDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.CurrentProcess)
            .NotEmpty().WithMessage("CurrentProcess is required.");

        RuleFor(x => x.Problem)
            .NotEmpty().WithMessage("Problem is required.");

        RuleFor(x => x.ExpectedImpact)
            .NotEmpty().WithMessage("ExpectedImpact is required.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Priority is not valid.");

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId must be greater than 0.");

        RuleFor(x => x.DepartmentId)
            .GreaterThan(0).WithMessage("DepartmentId must be greater than 0.");
    }
}
