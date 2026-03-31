using System.ComponentModel.DataAnnotations;

namespace DealershipSystem;

public class PrefectureDTO
{
    [Required]
    [MaxLength(15)]
    public string Name { get; set; }
}