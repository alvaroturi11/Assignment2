const $ = (sel) => document.querySelector(sel);

const titleCase = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, " ")
    .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const euros = (n) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

// --------- Creator JSON object ---------
const creator = {
  name: "Álvaro Turiégano",
  country: "Spain",
  age: 21,
  email: "20115695@setu.ie",
  bio: "Computer science student and car enthusiast."
};

// Render the creator info into #creatorCard
const renderCreator = () => {
  $("#creatorCard").innerHTML = `
    <div class="meta">
      <h4>${titleCase(creator.name)}</h4>
      <div class="kpis">
        <span class="kpi">Country: ${creator.country}</span>
        <span class="kpi">Age: ${creator.age}</span>
        <span class="kpi">Email: ${creator.email}</span>
      </div>
      <small class="muted">${creator.bio}</small>
    </div>
  `;
};
renderCreator();

// --------- Dataset stats (uses global `cars` from cars-data.js) ---------
const getStats = () => {
  const total = cars.length;
  const makes = [...new Set(cars.map(c => c.make))];
  const colourCount = cars.reduce((acc, c) => {
    const key = c.colour.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return { total, makes, colourCount };
};

// Inject dataset metrics into #datasetStats
const renderStats = () => {
  const { total, makes, colourCount } = getStats();
  const colours = Object.entries(colourCount)
    .map(([k, v]) => `${titleCase(k)}: ${v}`).join(" • ");

  $("#datasetStats").innerHTML = `
    <div class="meta">
      <h4>Cars dataset overview</h4>
      <div class="kpis">
        <span class="kpi">Total cars: ${total}</span>
        <span class="kpi">Distinct makes: ${makes.length}</span>
      </div>
      <p class="muted">Colours distribution → ${colours || "—"}</p>
    </div>
  `;
};
renderStats();

// --------- Make → Models mini demo (result appears under the <select>) ---------
const makeSelect = $("#makeSelect");

// On change, show the models for the selected make below the select
makeSelect.addEventListener("change", () => {
  const make = makeSelect.value;
  const models = [...new Set(cars.filter(c => c.make === make).map(c => c.model))].sort();

  const html = `
    <div id="modelsResult" style="margin-top: 0.6rem;">
      <h4>${make}</h4>
      <div class="kpis">
        ${models.map(m => `<span class="kpi">${m}</span>`).join("") || "<span class='kpi'>—</span>"}
      </div>
    </div>
  `;
  const existing = document.querySelector("#modelsResult");
  if (existing) existing.remove();
  makeSelect.insertAdjacentHTML("afterend", html);
});

// Populate the select with distinct makes from `cars`
(() => {
  const makes = [...new Set(cars.map(c => c.make))].sort();
  makeSelect.innerHTML =
    `<option value="" disabled selected hidden>Select a make…</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
})();

// --------- Fuel cost estimator (right panel) ---------
const tankEl = $("#tankCap");
const avgEl = $("#avgPerDay");
const priceEl = $("#fuelPrice");
const monthEl = $("#monthDays");
const fuelResult = $("#fuelResult");
const fuelForm = $("#fuelForm");

// Compute and render the fuel estimate into #fuelResult
const renderFuel = () => {
  const tank = Number(tankEl.value);
  const avg = Number(avgEl.value);
  const price = Number(priceEl.value);
  const monthDays = Number(monthEl.value);

  // Empty state until all required inputs have values
  if (!(tank > 0) || !(avg > 0) || !(price > 0)) {
    fuelResult.innerHTML = `
      <div class="meta">
        <h4>Results</h4>
        <p class="muted">Enter tank capacity, daily usage and fuel price to see the estimate.</p>
      </div>
    `;
    return;
  }

  const daysPerTank = tank / avg;                     // e.g., 50 L / 3 L/day = 16.67 days
  const costPerFill = tank * price;                   // e.g., 50 L * 1.8 €/L
  const fillsPerMonth = Math.ceil(monthDays / daysPerTank); // e.g., 31 / 16.7 → 2
  const monthlyCost = fillsPerMonth * costPerFill;

  fuelResult.innerHTML = `
  <div class="meta">
    <h4>Monthly fuel estimate</h4>
    <div class="kpis">
      <span class="kpi">Days per tank: ${daysPerTank.toFixed(1)}</span>
      <span class="kpi">Cost per fill: ${euros(costPerFill)}</span>
      <span class="kpi">Fills / month: ${fillsPerMonth}</span>
      <span class="kpi">Monthly cost: ${euros(monthlyCost)}</span>
    </div>
  </div>
`;

};

// Live updates on any input change
["input", "change"].forEach(evt => {
  tankEl.addEventListener(evt, renderFuel);
  avgEl.addEventListener(evt, renderFuel);
  priceEl.addEventListener(evt, renderFuel);
  monthEl.addEventListener(evt, renderFuel);
});

// After form reset, re-render the empty state
fuelForm.addEventListener("reset", (e) => {
  setTimeout(renderFuel, 0); // wait for the browser to clear inputs
});

// Initial paint
renderFuel();

// --------- Rotación de imagen en la sección About ---------
const aboutImg = document.querySelector("#aboutImg");

if (aboutImg) {
  const aboutImages = [
    "SportCar.jpg",
    "sport2.jpg",
    "sport3.jpg"
  ];

  let currentIndex = 0; // SportCar.jpg es la inicial

  setInterval(() => {
    currentIndex = (currentIndex + 1) % aboutImages.length;
    aboutImg.src = `assets/images/${aboutImages[currentIndex]}`;
  }, 5000); // 5000 ms = 5 segundos
}
