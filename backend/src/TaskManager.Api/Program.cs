using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        // mantiene respuesta por defecto de ModelState (400)
        options.SuppressModelStateInvalidFilter = false;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar EF Core - SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       "Data Source=taskmanager.db";
builder.Services.AddDbContext<TaskContext>(options =>
    options.UseSqlite(connectionString));

// Configurar CORS para Angular (puedes ajustar origen)
var allowedOrigin = "AngularDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigin,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Aplicar migraciones automáticamente (opcional)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TaskContext>();
    db.Database.Migrate(); // aplica migraciones si las hay
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AngularDev");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
