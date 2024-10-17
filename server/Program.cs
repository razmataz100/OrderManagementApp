var builder = WebApplication.CreateBuilder(args);

// Lägg till tjänster i containern
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Konfigurera HTTP-begäran
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Här kan du lägga till dina API-rutter
// Till exempel: app.MapGet("/api/yourendpoint", () => { /* din logik här */ });

app.Run();
