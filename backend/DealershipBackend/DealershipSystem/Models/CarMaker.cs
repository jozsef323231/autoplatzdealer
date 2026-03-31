using System.ComponentModel.DataAnnotations;

namespace DealershipSystem.Models;

public class CarMaker
{
    public int ID { get; set; }
    public string BrandEnglish { get; set; } = string.Empty!;
}