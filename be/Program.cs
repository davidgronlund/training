using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();


var app = builder.Build();


app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


app.MapPost("/api/workouts", async (Workout[] workouts) =>
{
    var json = JsonSerializer.Serialize(workouts);
    await File.WriteAllTextAsync("workouts.json", json);
});

app.MapGet("/api/workouts", async () =>
{
    /*
    var j = new Workout[]
    {
        new Workout
        {
            Id = 1,
            Type = "Running",
            Date = "2022-01-01",
        },
        new Workout        {
            Id = 2,
            Type = "Gym",
            Date = "2022-01-01",
        },
    };
    
    var json = JsonSerializer.Serialize(j);
    
    await File.WriteAllTextAsync("workouts.json", json);
    */
    
    
    var result = await File.ReadAllTextAsync("workouts.json");
    return JsonSerializer.Deserialize<Workout[]>(result);
});



// CORS

app.Run();


internal class Workout {
    public int Id { get; set; }
    public string? Type { get; set; }
    public string? Date { get; set; }
    public int? Duration { get; set; }
    public string? Comment { get; set; }
    
}