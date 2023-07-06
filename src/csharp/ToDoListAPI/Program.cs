using ToDoListAPI.Repositories;
using ToDoListAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

/// <summary>
/// YB - Pair interfaces with service class
/// </summary>
builder.Services.AddTransient<IToDoRepository, ToDoRepository>();

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
