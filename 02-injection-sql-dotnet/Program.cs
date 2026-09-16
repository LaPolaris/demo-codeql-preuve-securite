using Catalogue;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CatalogueContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Catalogue")
            ?? "Host=localhost;Database=catalogue"));

var app = builder.Build();

// La chaîne interpolée n'en est pas une : FromSql reçoit une FormattableString
// et place un paramètre de base de données à chaque accolade.
app.MapGet("/produits", async (string categorie, CatalogueContext db) =>
{
    var produits = await db.Produits
        .FromSql($"SELECT * FROM Produit WHERE Categorie = {categorie}")
        .ToListAsync();

    return Results.Ok(produits);
});

app.Run();
