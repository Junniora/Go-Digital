using FluentValidation;
using FluentValidation.AspNetCore;
using GoDigital.API.Data;
using GoDigital.API.Middleware;
using GoDigital.API.Services;
using GoDigital.API.Validators;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Configure Database
builder.Services.AddDbContext<GoDigitalDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<CreateRequestDtoValidator>();

// Register Application Services
builder.Services.AddScoped<IRequestService, RequestService>();
builder.Services.AddScoped<ICatalogService, CatalogService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors("AllowFrontend");

app.UseAuthorization();

// Serve the Vue/Quasar SPA static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// SPA fallback: any non-API route that doesn't match a file → serve index.html
app.MapFallbackToFile("index.html");

app.Run();