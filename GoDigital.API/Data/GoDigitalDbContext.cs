using GoDigital.API.Models;
using GoDigital.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GoDigital.API.Data;

public class GoDigitalDbContext : DbContext
{
    public GoDigitalDbContext(DbContextOptions<GoDigitalDbContext> options) : base(options)
    {
    }

    public DbSet<Request> Requests { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<RequestStatus> RequestStatuses { get; set; }
    public DbSet<RequestComment> RequestComments { get; set; }
    public DbSet<Attachment> Attachments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure enum string conversion for Priority
        modelBuilder.Entity<Request>()
            .Property(r => r.Priority)
            .HasConversion<string>();

        // Relationships
        modelBuilder.Entity<Request>()
            .HasOne(r => r.Department)
            .WithMany(d => d.Requests)
            .HasForeignKey(r => r.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.User)
            .WithMany(u => u.Requests)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.Status)
            .WithMany(s => s.Requests)
            .HasForeignKey(r => r.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestComment>()
            .HasOne(c => c.Request)
            .WithMany(r => r.Comments)
            .HasForeignKey(c => c.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RequestComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Attachment>()
            .HasOne(a => a.Request)
            .WithMany(r => r.Attachments)
            .HasForeignKey(a => a.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed Data
        modelBuilder.Entity<RequestStatus>().HasData(
            new RequestStatus { Id = 1, Name = "Nuevo" },
            new RequestStatus { Id = 2, Name = "En revisión DX" },
            new RequestStatus { Id = 3, Name = "En backlog" },
            new RequestStatus { Id = 4, Name = "En desarrollo" },
            new RequestStatus { Id = 5, Name = "En pruebas" },
            new RequestStatus { Id = 6, Name = "Entregado" },
            new RequestStatus { Id = 7, Name = "Cerrado" }
        );

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "210 QEP" },
            new Department { Id = 2, Name = "122 IT" },
            new Department { Id = 3, Name = "221 QA" },
            new Department { Id = 4, Name = "507 IoT" },
            new Department { Id = 5, Name = "222 QC" }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Admin User", Email = "admin@godigital.com", DepartmentId = 3 },
            new User { Id = 2, Name = "HR Manager", Email = "hr@godigital.com", DepartmentId = 1 }
        );
    }
}
