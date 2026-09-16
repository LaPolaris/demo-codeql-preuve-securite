using Catalogue;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CatalogueContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Catalogue")
            ?? "Host=localhost;Database=catalogue"));

var app = builder.Build();

// Filtre par catégorie demandé par le métier.
app.MapGet("/produits", async (string categorie, CatalogueContext db) =>
{
    var produits = await db.Produits
        .FromSqlRaw("SELECT * FROM Produit WHERE Categorie = '" + categorie + "'")
        .ToListAsync();

    return Results.Ok(produits);
});

app.Run();
