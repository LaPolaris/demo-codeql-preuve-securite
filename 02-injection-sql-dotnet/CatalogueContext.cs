using Microsoft.EntityFrameworkCore;

namespace Catalogue;

public class CatalogueContext(DbContextOptions<CatalogueContext> options)
    : DbContext(options)
{
    public DbSet<Produit> Produits => Set<Produit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // La table s'appelle « produit » au singulier, comme dans l'exemple 1 :
        // les deux démonstrations peuvent viser la même base.
        modelBuilder.Entity<Produit>().ToTable("produit");
    }
}
