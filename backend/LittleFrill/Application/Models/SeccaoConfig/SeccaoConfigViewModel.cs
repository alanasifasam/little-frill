using Application.Mapping;

namespace Application.Models.SeccaoConfig;

public class SeccaoConfigViewModel
{
    public string Seccao { get; set; } = string.Empty;
    public bool Ativa { get; set; }

    public static SeccaoConfigViewModel FromEntity(Core.Entities.SeccaoConfig seccaoConfig)
    {
        return new SeccaoConfigViewModel
        {
            Seccao = SeccaoMapper.ToChave(seccaoConfig.Seccao),
            Ativa = seccaoConfig.Ativa
        };
    }
}
