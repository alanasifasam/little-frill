using System.Text;
using Application;
using Core.Entities;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Auth;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

const string frontendDevCorsPolicy = "FrontendDev";

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Introduz o token no formato: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration, builder.Environment.WebRootPath);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(frontendDevCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Migrate() aplica o histórico de migrações (schema + seed via HasData/InsertData)
// contra a base de dados Postgres real, de forma idempotente a cada arranque.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LittleFrillDbContext>();
    dbContext.Database.Migrate();

    // Semeia a única conta admin, se ainda não existir nenhuma. Sem
    // endpoint de promoção nem ecrã de criação — este é o único caminho
    // que produz um Utilizador com Role.Admin (ver Utilizador.CriarAdmin).
    // A password vem de configuração (Admin:Password, appsettings.Development.json)
    // e é um segredo de desenvolvimento: tem de ser trocada antes de
    // qualquer ambiente real.
    var utilizadorRepository = scope.ServiceProvider.GetRequiredService<IUtilizadorRepository>();
    if (!await utilizadorRepository.ExisteAdminAsync())
    {
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var adminNome = builder.Configuration["Admin:Nome"]!;
        var adminSobrenome = builder.Configuration["Admin:Sobrenome"]!;
        var adminEmail = builder.Configuration["Admin:Email"]!;
        var adminPassword = builder.Configuration["Admin:Password"]!;

        var admin = Utilizador.CriarAdmin(
            adminNome,
            adminSobrenome,
            adminEmail,
            passwordHasher.Hash(adminPassword));

        await utilizadorRepository.AdicionarAsync(admin);
        await unitOfWork.SaveChangesAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors(frontendDevCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
