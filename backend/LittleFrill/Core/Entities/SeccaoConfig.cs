using Core.Enums;

namespace Core.Entities;

// Uma linha por valor do enum Seccao. As 7 linhas são semeadas por
// SeccaoConfigConfiguration; não há criação nem remoção em runtime, só
// toggle (DefinirAtiva) — mesmo espírito de MetodoPagamentoConfig.
public class SeccaoConfig
{
    protected SeccaoConfig()
    {
    }

    public SeccaoConfig(Seccao seccao, bool ativa)
    {
        Seccao = seccao;
        Ativa = ativa;
    }

    public int Id { get; private set; }
    public Seccao Seccao { get; private set; }
    public bool Ativa { get; private set; }

    public void DefinirAtiva(bool ativa)
    {
        Ativa = ativa;
    }
}
