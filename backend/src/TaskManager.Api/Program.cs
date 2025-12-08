using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Agrega servicios al contenedor

// Agrega soporte para controladores
builder.Services.AddControllers();

// Swagger para documentación y pruebas de la API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura la base de datos SQLite
builder.Services.AddDbContext<TaskContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

// Configura CORS para permitir llamadas desde Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp",
        policy => policy.WithOrigins("http://localhost:4200") // Angular dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// 2️⃣ Aplica migraciones automáticamente al iniciar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TaskContext>();
    db.Database.Migrate();
}

// 3️⃣ Configura el pipeline HTTP

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Habilita CORS antes de los controladores
app.UseCors("AngularApp");

app.UseAuthorization();

// Mapea los controladores
app.MapControllers();

app.Run();
