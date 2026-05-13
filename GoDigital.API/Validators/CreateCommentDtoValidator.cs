using FluentValidation;
using GoDigital.API.DTOs;

namespace GoDigital.API.Validators;

public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
{
    public CreateCommentDtoValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId must be greater than 0.");

        RuleFor(x => x.Comment)
            .NotEmpty().WithMessage("Comment is required.")
            .MaximumLength(1000).WithMessage("Comment must not exceed 1000 characters.");
    }
}
