namespace Catalogue;

public class Produit
{
    public int Id { get; set; }

    public string Nom { get; set; } = string.Empty;

    public decimal Prix { get; set; }

    public string Categorie { get; set; } = string.Empty;
}
