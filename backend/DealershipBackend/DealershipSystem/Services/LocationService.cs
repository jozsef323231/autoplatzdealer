using AutoMapper;
using DealershipSystem.Context;
using DealershipSystem.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealershipSystem.Services;

/// <summary>
/// Service for managing locations within the dealership system.
/// </summary>
public class LocationService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="LocationService"/> class.
    /// </summary>
    /// <param name="mapper">The mapper for mapping entities.</param>
    /// <param name="context">The application database context.</param>
    public LocationService(IMapper mapper, ApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    /// <summary>
    /// Gets all locations asynchronously.
    /// </summary>
    /// <returns>A list of all locations.</returns>
    public async Task<List<Location>> GetAllLocationsAsync()
    {
        var locations = await _context.Locations.ToListAsync();
        return locations;
    }

    /// <summary>
    /// Gets a location by ID asynchronously.
    /// </summary>
    /// <param name="id">The ID of the location.</param>
    /// <returns>The location DTO if found; otherwise, null.</returns>
    public async Task<LocationDto> GetLocationByIdAsync(int id)
    {
        var location = await _context.Locations.FirstOrDefaultAsync(i => i.ID == id);
        if (location == null)
        {
            return null;
        }

        return _mapper.Map<LocationDto>(location);
    }

    /// <summary>
    /// Creates a new location asynchronously.
    /// </summary>
    /// <param name="location">The location DTO.</param>
    /// <returns>An action result indicating the outcome of the creation.</returns>

    public async Task<LocationDto> CreateLocationAsync(LocationDto location)
    {
        if (location == null || location.Address == null)
        {
            throw new ArgumentNullException(nameof(location), "Location or Address is null.");
        }

        // Perform the mapping
        var entity = _mapper.Map<Models.Location>(location);

        _context.Locations.Add(entity);
        await _context.SaveChangesAsync();

        return location;
    }

    /// <summary>
    /// Updates an existing location asynchronously.
    /// </summary>
    /// <param name="locationDto">The location DTO with updated information.</param>
    /// <returns>The updated location if successful; otherwise, null.</returns>
    public async Task<Location> UpdateLocationAsync(LocationDto locationDto)
    {
        // Fetch the existing location with Address details
        var existingLocation = await _context.Locations
            .Include(l => l.Address)
            .FirstOrDefaultAsync(l => l.ID == locationDto.Id);

        if (existingLocation == null)
        {
            return null; // Location not found
        }

        // Ensure that Address is loaded and not null
        if (existingLocation.Address == null)
        {
            return null; // Address not found for this location
        }

        // Update the location details
        existingLocation.LocationName = locationDto.LocationName;
        existingLocation.Address.City = locationDto.Address.City;
        existingLocation.Address.CityRomanized = locationDto.Address.CityRomanized;
        existingLocation.Address.Street = locationDto.Address.Street;
        existingLocation.Address.StreetRomanized = locationDto.Address.StreetRomanized;
        existingLocation.Address.PostalCode = locationDto.Address.PostalCode;
        existingLocation.PhoneNumber = locationDto.PhoneNumber;
        existingLocation.MaxCapacity = locationDto.MaxCapacity;

        try
        {
            // Save changes to the database
            _context.Locations.Update(existingLocation);
            await _context.SaveChangesAsync();

            return existingLocation; // Return the updated location
        }
        catch (Exception ex)
        {
            // Log and throw exception for debugging
            Console.WriteLine($"Error: {ex.Message}");
            throw new InvalidOperationException("Error updating location", ex);
        }
    }


    /// <summary>
    /// Gets all prefectures asynchronously.
    /// </summary>
    /// <returns>A list of all prefectures.</returns>
    public async Task<List<PrefectureDTO>> GetAllPrefectures()
    {
        var prefectures = await _context.Prefectures.ToListAsync();
        return _mapper.Map<List<PrefectureDTO>>(prefectures);
    }

    /// <summary>
    /// Deletes a location asynchronously.
    /// </summary>
    /// <param name="locationId">The ID of the location to delete.</param>
    /// <returns>True if the location was deleted; otherwise, false.</returns>
    public async Task<bool> DeleteLocationAsync(int locationId)
    {
        var location = await _context.Locations.FindAsync(locationId);
        if (location == null)
        {
            return false; 
        }

        try
        {
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting location", ex);
        }
    }

    /// <summary>
    /// Gets the car usage in a location asynchronously.
    /// </summary>
    /// <param name="locationId">The ID of the location.</param>
    /// <returns>A tuple containing the maximum capacity and current usage if found; otherwise, null.</returns>
    public async Task<(int MaxCapacity, int CurrentUsage)?> GetCarUsageInLocationAsync(int locationId)
    {
        var location = await _context.Locations
            .Where(l => l.ID == locationId)
            .Select(l => new
            {
                l.MaxCapacity,
                CurrentUsage = _context.Cars.Count(c => c.LocationID == locationId)
            })
            .FirstOrDefaultAsync();

        if (location == null)
        {
            return null; // Location not found
        }

        return (location.MaxCapacity, location.CurrentUsage);
    }
}