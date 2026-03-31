using System.Configuration;
using DealershipSystem.Configurations;
using DealershipSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DealershipSystem.Context;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<Models.Location> Locations { get; set; }
    public DbSet<Models.Prefecture> Prefectures { get; set; }
    public DbSet<Models.Address> Addresses { get; set; }
    public DbSet<Car> Cars { get; set; } = null!;
    public DbSet<CarMaker> CarMakers { get; set; } = null!;
    public DbSet<CarModel> CarModels { get; set; } = null!;
    public DbSet<BodyType> BodyTypes { get; set; } = null!;
    public DbSet<EngineSizeModel> EngineSizeModels { get; set; } = null!;
    public DbSet<FuelType> FuelTypes { get; set; } = null!;
    public DbSet<DrivetrainType> DrivetrainTypes { get; set; } = null!;
    public DbSet<TransmissionType> TransmissionTypes { get; set; } = null!;
    public DbSet<Color> Colors { get; set; } = null!;
    public DbSet<CarExtra> CarExtras { get; set; } = null!;
    public DbSet<Image> Images { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;

    public DbSet<SavedCar> SavedCars { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<EmployeeLocation> EmployeeLocations { get; set; } = null!;
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new PrefectureConfiguration());
        
        modelBuilder.Entity<IdentityUserLogin<string>>()
            .HasKey(e => e.UserId);  

        modelBuilder.Entity<IdentityUserRole<string>>()
            .HasKey(e => new { e.UserId, e.RoleId }); 

        modelBuilder.Entity<IdentityUserClaim<string>>()
            .HasKey(e => e.Id);  

        modelBuilder.Entity<IdentityUserToken<string>>()
            .HasKey(e => new { e.UserId, e.LoginProvider, e.Name });
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        modelBuilder.Entity<Car>()
            .HasMany(c => c.Images)
            .WithOne(i => i.Car)
            .HasForeignKey(i => i.CarID);

        modelBuilder.Entity<Car>()
            .HasMany(c => c.CarExtras)
            .WithOne(ce => ce.Car)
            .HasForeignKey(ce => ce.CarID);

        modelBuilder.Entity<CarModel>()
            .HasMany(m => m.EngineSizes)
            .WithOne(es => es.CarModel)
            .HasForeignKey(es => es.ModelID);
        
        modelBuilder.Entity<EngineSizeModel>()
            .HasOne(es => es.CarModel)
            .WithMany(m => m.EngineSizes)
            .HasForeignKey(es => es.ModelID)
            .OnDelete(DeleteBehavior.Cascade);

        // Car and EngineSizeModel relationship
        modelBuilder.Entity<Car>()
            .HasOne(c => c.EngineSize)
            .WithMany()
            .HasForeignKey(c => c.EngineSizeID)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<EmployeeLocation>()
            .HasOne(el => el.Location)        // EmployeeLocation has one Location
            .WithMany()                        // Location can have many EmployeeLocations
            .HasForeignKey(el => el.LocationId) // ForeignKey in EmployeeLocation
            .OnDelete(DeleteBehavior.Cascade); // Or whatever behavior you want for delete

        
        modelBuilder.Entity<Prefecture>().HasData(
            new Prefecture { Id = 1, Name = "Győr-Moson-Sopron" },
            new Prefecture { Id = 4, Name = "Fejér" },
            new Prefecture { Id = 12, Name = "Budapest" },
            new Prefecture { Id = 13, Name = "Budapest" },
            new Prefecture { Id = 14, Name = "Pest" },
            new Prefecture { Id = 23, Name = "Hajdú-Bihar" },
            new Prefecture { Id = 27, Name = "Budapest" },
            new Prefecture { Id = 40, Name = "Hajdú-Bihar" },
            new Prefecture { Id = 47, Name = "Pest" }
        );
        
        modelBuilder.Entity<BodyType>().HasData(
            new BodyType { ID = 1, NameEnglish = "Kei Car" },
            new BodyType { ID = 2, NameEnglish = "Compact Car" },
            new BodyType { ID = 3, NameEnglish = "Minivan/One-Box" },
            new BodyType { ID = 4, NameEnglish = "Sedan" },
            new BodyType { ID = 5, NameEnglish = "Coupe" },
            new BodyType { ID = 6, NameEnglish = "Station Wagon" },
            new BodyType { ID = 7, NameEnglish = "SUV/Crossover" },
            new BodyType { ID = 8, NameEnglish = "Truck/Van" },
            new BodyType { ID = 9, NameEnglish = "Hatchback" }
        );
        
        modelBuilder.Entity<TransmissionType>().HasData(
            new TransmissionType { ID = 1, Type = "MT" },  // Manual Transmission
            new TransmissionType { ID = 2, Type = "AT" },  // Automatic Transmission
            new TransmissionType { ID = 3, Type = "CVT" }, // Continuously Variable Transmission
            new TransmissionType { ID = 4, Type = "AMT" }, // Automated Manual Transmission
            new TransmissionType { ID = 5, Type = "DCT" }  // Dual Clutch Transmission
        );
        
        modelBuilder.Entity<FuelType>().HasData(
            new FuelType { ID = 1, NameEnglish = "Gasoline" },
            new FuelType { ID = 2, NameEnglish = "Diesel" },
            new FuelType { ID = 3, NameEnglish = "Electric" },
            new FuelType { ID = 4, NameEnglish = "Hybrid" },
            new FuelType { ID = 5, NameEnglish = "LPG" }
        );
        
        modelBuilder.Entity<DrivetrainType>().HasData(
            new DrivetrainType { ID = 1, Type = "FWD" }, 
            new DrivetrainType { ID = 2, Type = "RWD" },
            new DrivetrainType { ID = 3, Type = "AWD" }, 
            new DrivetrainType { ID = 4, Type = "4WD" } 
        );
        
        modelBuilder.Entity<Color>().HasData(
            new Color { ID = 1, ColorNameEnglish = "White" },
            new Color { ID = 2, ColorNameEnglish = "Black" },
            new Color { ID = 3, ColorNameEnglish = "Red" },
            new Color { ID = 4, ColorNameEnglish = "Blue" },
            new Color { ID = 5, ColorNameEnglish = "Silver" },
            new Color { ID = 6, ColorNameEnglish = "Gray" },
            new Color { ID = 7, ColorNameEnglish = "Gold" },
            new Color { ID = 8, ColorNameEnglish = "Beige" },
            new Color { ID = 9, ColorNameEnglish = "Brown" },
            new Color { ID = 10, ColorNameEnglish = "Orange" },
            new Color { ID = 11, ColorNameEnglish = "Pink" },
            new Color { ID = 12, ColorNameEnglish = "Purple" },
            new Color { ID = 13, ColorNameEnglish = "Yellow" },
            new Color { ID = 14, ColorNameEnglish = "Green" },
            new Color { ID = 15, ColorNameEnglish = "Other" }
        );
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }
    
    
}

