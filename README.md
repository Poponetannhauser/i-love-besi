<a id="readme-top"></a>

<div align="center">
  <h2 align="center">ILoveBesi</h2>

  <p align="center">
    A professional construct-tech tool designed for Quantity Surveyors (QS), contractors, and steel fixers in Indonesia to calculate standard rebar weight and minimize waste using combinatorial optimization.
    <br />
    <a href="https://github.com/Poponetannhauser/i-love-besi"><strong>Explore the docs »</strong></a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features-and-engineering-highlights">Features & Engineering Highlights</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

ILoveBesi is a web application tailored for real-world reinforcement steel (_rebar_) estimation on Indonesian construction sites.

### Built With

- **Backend**: ASP.NET Core 8 Web API, C#, Entity Framework Core (EF Core), SQLite, JWT Bearer Auth.
- **Frontend**: React, Vite, Custom CSS.

## Getting Started

### Prerequisites
- Node.js & npm
- .NET 8.0 SDK

### Running Backend (.NET API)
```sh
cd backend/ILoveBesi.Api
dotnet run
```
Access Swagger UI at `http://localhost:5000/swagger`.

### Running Frontend (React)
```sh
npm install
npm run dev
```
Access UI at `http://localhost:5173`.

## Features and Engineering Highlights

- **ASP.NET Core Web API**: Clean Architecture backend service.
- **1D Cutting Stock Optimizer (FFD)**: First-Fit Decreasing heuristic algorithm in C# to minimize rebar cutting waste.
- **JWT & RBAC**: Secure authentication with `Admin` and `FieldUser` role policies.
- **SNI Weight Calculator**: Standard Indonesian National SNI weight calculations.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Paundra - paundraexe@gmail.com  
Project Link: [https://github.com/Poponetannhauser/i-love-besi](https://github.com/Poponetannhauser/i-love-besi)
