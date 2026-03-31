using System.ComponentModel.DataAnnotations;

namespace DealershipSystem.Models;

public class Address
{
    public int Id { get; set; }

    [MaxLength(8)]
    [Required]
    public string PostalCode { get; set; }

    [Required]
    public string City { get; set; }

    [Required]
    public string CityRomanized { get; set; }

    [Required]
    public string Street { get; set; }

    [Required]
    public string StreetRomanized { get; set; }
}
