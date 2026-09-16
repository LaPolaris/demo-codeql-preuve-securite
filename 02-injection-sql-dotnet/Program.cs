using Catalogue;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CatalogueContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Catalogue")
            ?? "Host=localhost;Database=catalogue"));

var app = builder.Build();

// Catalogue complet : aucune donnée fournie par le client n'entre dans la
// requête, et LINQ paramètre de toute façon ce qu'il traduit en SQL.
app.MapGet("/produits", async (CatalogueContext db) =>
    Results.Ok(await db.Produits.OrderBy(p => p.Nom).ToListAsync()));

app.Run();
