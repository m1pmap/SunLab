using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SunLab2.DAL;
using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IUser, User_Repository>();
builder.Services.AddScoped<IDisease, Disease_Repository>();
builder.Services.AddScoped<ISymptom, Symptom_Repository>();
builder.Services.AddScoped<ITherapy, Therapy_Repository>();
builder.Services.AddScoped<IDrug, Drug_Repository>();

builder.Services.AddDbContext<ApplicationContext>();

// ��������� ���� ��� ������
builder.Services.AddDistributedMemoryCache(); // ��������� ��� ��� �������� ������ ������
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(120); // ���������� ������� ��� ������
    options.Cookie.HttpOnly = true; // ���������� ���� HttpOnly ��� ������������
    options.Cookie.IsEssential = true; // ���������, ��� ���� ����� ����������� ���� ��� ���������� �������� ������������
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // �������� ������������� ������

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Main}/{action=Index}/{id?}");

app.Run();