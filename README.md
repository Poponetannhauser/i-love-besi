<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">ILoveBesi</h2>

  <p align="center">
    A professional construct-tech tool designed for Quantity Surveyors (QS), contractors, and steel fixers in Indonesia to calculate standard rebar weight and minimize waste using combinatorial optimization.
    <br />
    <a href="https://github.com/Poponetannhauser/i-love-besi"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Poponetannhauser/i-love-besi">View Demo</a>
    &middot;
    <a href="https://github.com/Poponetannhauser/i-love-besi/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/Poponetannhauser/i-love-besi/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
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
    <li><a href="#project-status">Project Status</a></li>
    <li><a href="#features-and-engineering-highlights">Features & Engineering Highlights</a></li>
    <li><a href="#mathematical-foundations">Mathematical Foundations</a></li>
    <li><a href="#development-philosophy">Development Philosophy</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

ILoveBesi is a lightweight web application tailored for real-world reinforcement steel (*rebar*) estimation on Indonesian construction sites. Standard estimators typically use simple multiplication formulas that ignore material wastage during actual cutting. This project serves as a showcase portfolio that solves critical field challenges:
1. **Logistics Discrepancy (Besi Banci)**: Detecting and correcting rebar weight calculations when supplier diameters deviate from official SNI labels using dynamic tolerance factors.
2. **Material Optimization**: Solving the combinatoric 1D *Cutting Stock Problem* to compute optimal cutting patterns from standard 12-meter rebars, significantly minimizing steel scrap (*waste*).

This project highlights unidirectional React state management, client-side persistence, modular custom CSS layout design, and memory-conscious calculations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built purely using modern web APIs and does not rely on heavy external UI frameworks, prioritizing fast initial loading times.

* [![React][React.js]][React-url]
* [![Vite][Vite.js]][Vite-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To run a local copy of this project on your system, follow these simple setup steps.

### Prerequisites

You only need Node.js installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Poponetannhauser/i-love-besi.git
   ```
2. Navigate into the directory:
   ```sh
   cd i-love-besi
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the local development server:
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STATUS -->
## Project Status

* **Phase 1 (MVP) - Complete**: Implemented core rebar weight calculator, rekap table, validation inputs, and browser local storage persistence.
* **Phase 2 (Edge Cases) - Implementation Complete, User Validation In Progress**: Built all advanced features (F2.1 - F2.5) including 1D Cutting Stock heuristics, lap splice connectors, 135° earthquake sengkang hooks, dynamic zone distributions, and tolerance corrections. Verified against real-world construction data.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES AND ENGINEERING HIGHLIGHTS -->
## Features and Engineering Highlights

* **Precision Weight Calculator**: Formulates exact weights with guard clauses for negative values and decimal precision up to 4 places based on the SNI formula `W = 0.006165 * d^2 * L * N`.
* **1D Cutting Stock Optimizer (F2.1)**: Implements the **First-Fit Decreasing (FFD)** heuristic algorithm ($O(n \log n)$) to match field-required steel lengths against 12-meter base stock, presenting visual cutting schemes per bar.
* **Lap Splice Calculator (F2.2)**: Calculates exact overlap lengths using structural factors like $40d$ or $50d$ (born directly from user feedback during Phase 1 demo).
* **Earthquake Hooks (F2.3)**: Toggle calculations for 135° earthquake hooks versus standard 90° sengkang configurations.
* **Sengkang Dynamic Zoning (F2.4)**: Automatically determines rebar layouts across balok/kolom dividing zones into tumpuan (ends) and lapangan (middle).
* **Besi Banci Factor Correction (F2.5)**: Introduces tolerance corrections for sub-standard actual diameters, serving as a transparent tool to verify weight logs against supplier quotes.
* **Master Ledger & Aggregations**: Groups and summarizes materials dynamically using React `useMemo` hooks to avoid expensive re-calculations on layout updates.
* **Responsive Layout (iPad Pro Portrait Drawer)**: Optimized styling using pure CSS variables and responsive media queries that transition the sidebar into an overlay drawer for tablet interfaces.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MATHEMATICAL FOUNDATIONS -->
## Mathematical Foundations

### Standard SNI Rebar Weight
The core engine computes the nominal rebar weight based on Indonesian National Standards (SNI):

$$W = 0.006165 \times d^2 \times L \times N$$

Where:
* $d$ = diameter of the rebar (in millimeters)
* $L$ = length of the bar (in meters, standard stock is 12m)
* $N$ = quantity of rebars (in pieces)
* $W$ = calculated total weight (in kilograms)

### Overlap Length Calculation
Calculates the extra splicing length needed when connecting two structural rebars:

$$\text{Lap Splice} = \frac{d \times \text{Factor}}{1000}$$

Where the *Factor* is typically standard structural values like $40d$ or $50d$.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEVELOPMENT PHILOSOPHY -->
## Development Philosophy

The project is structured around iterative deployment:
1. Deliver a functional MVP to validate calculations and gather field feedback.
2. Build advanced field optimizations (such as lap splices and cutting optimizations) based strictly on real surveyor requests instead of predictive assumptions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Paundra - paundraexe@gmail.com

Project Link: [https://github.com/Poponetannhauser/i-love-besi](https://github.com/Poponetannhauser/i-love-besi)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Poponetannhauser/i-love-besi.svg?style=for-the-badge
[contributors-url]: https://github.com/Poponetannhauser/i-love-besi/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Poponetannhauser/i-love-besi.svg?style=for-the-badge
[forks-url]: https://github.com/Poponetannhauser/i-love-besi/network/members
[stars-shield]: https://img.shields.io/github/stars/Poponetannhauser/i-love-besi.svg?style=for-the-badge
[stars-url]: https://github.com/Poponetannhauser/i-love-besi/stargazers
[issues-shield]: https://img.shields.io/github/issues/Poponetannhauser/i-love-besi.svg?style=for-the-badge
[issues-url]: https://github.com/Poponetannhauser/i-love-besi/issues
[license-shield]: https://img.shields.io/github/license/Poponetannhauser/i-love-besi.svg?style=for-the-badge
[license-url]: https://github.com/Poponetannhauser/i-love-besi/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/paundra
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
