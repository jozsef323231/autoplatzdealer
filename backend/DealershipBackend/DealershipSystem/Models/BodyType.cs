using System.ComponentModel.DataAnnotations;

namespace DealershipSystem.Models;

public class BodyType
{
    [Required]
    public int ID { get; set; }
    public string NameEnglish { get; set; } = string.Empty!;
}