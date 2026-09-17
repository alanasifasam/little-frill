using Core.Enums;

namespace Application.Mapping;

public static class SeccaoMapper
{
    public static string ToChave(Seccao seccao)
    {
        return seccao switch
        {
            Seccao.Acessorios => "acessorios",
            Seccao.Bebe => "bebe",
            Seccao.Mesa => "mesa",
            Seccao.Banho => "banho",
            Seccao.Cama => "cama",
            Seccao.Cozinha => "cozinha",
            Seccao.Animais => "animais",
            _ => throw new ArgumentOutOfRangeException(nameof(seccao), seccao, "Secção desconhecida.")
        };
    }

    public static Seccao? ParseChave(string? chave)
    {
        return chave switch
        {
            "acessorios" => Seccao.Acessorios,
            "bebe" => Seccao.Bebe,
            "mesa" => Seccao.Mesa,
            "banho" => Seccao.Banho,
            "cama" => Seccao.Cama,
            "cozinha" => Seccao.Cozinha,
            "animais" => Seccao.Animais,
            _ => null
        };
    }
}
