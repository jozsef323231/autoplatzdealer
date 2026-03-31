using System.ComponentModel.DataAnnotations;

namespace DealershipSystem.Models;

public class Prefecture
{
    public int Id { get; set; }
    [Required]
    [MaxLength(15)]
    public string Name { get; set; }
}
