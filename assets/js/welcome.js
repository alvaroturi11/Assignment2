// Convert a string to Title Case (e.g., "toyota corolla" → "Toyota Corolla")
const titleCase = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, " ")
    .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// Format a number as Euro currency (e.g., 15000 → €15,000.00)
const euros = n =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

// Greeting message
(() => {
  const now = new Date();
  const h = now.getHours();
  const msg = h < 12 ? "GOOD MORNING" : h < 20 ? "GOOD AFTERNOON" : "GOOD EVENING";

  const greetingEl = document.querySelector("#greeting");
  if (greetingEl) {
    greetingEl.textContent = `${msg} — TODAY IS ${now.toLocaleDateString("en-GB")}`;
  }
})();

// --------- Elements ---------
const form = document.querySelector("#previewForm");
const brandEl = document.querySelector("#brand");
const modelEl = document.querySelector("#model");
const priceEl = document.querySelector("#price");
const monthsEl = document.querySelector("#months");
const aprEl = document.querySelector("#apr");
const itvEl = document.querySelector("#itv");
const monthsBadge = document.querySelector("#monthsBadge");
const result = document.querySelector("#result");
const resetBtn = document.querySelector("#resetBtn");

// Turn result container into a scrollable card list
result.classList.add("cards");

// Create "Clear all" button inside result panel
const clearAllBtn = document.createElement("button");
clearAllBtn.textContent = "Clear all";
clearAllBtn.className = "btn ghost small clear-all-btn";
result.parentElement.style.position = "relative"; // ensures positioning context
result.parentElement.appendChild(clearAllBtn);

// Calculate monthly loan payment
const monthlyPayment = (price, apr, months) => {
  const r = (apr / 100) / 12;
  if (r === 0) return price / months;
  const f = Math.pow(1 + r, months);
  return (price * r * f) / (f - 1);
};

// Calculate days until next inspection (NCT/MOT)
const daysUntil = (isoDate) => {
  if (!isoDate) return null;
  const today = new Date();
  const target = new Date(isoDate + "T00:00:00");
  const DAY = 1000 * 60 * 60 * 24;
  return Math.ceil((target - today) / DAY);
};

let previewCars = []; // holds temporary list of preview cars

// Logos pictures
const LOGOS = {
  Ford: "ford.png",
  Hyundai: "hyundai.png",
  Toyota: "toyota.png",
  Renault: "renault.png",
  Nissan: "nissan.png",
  Tesla: "tesla.png",
  Audi: "audi.png",
  Cupra: "cupra.png",
  Fiat: "fiat.png",
  Bmw: "bmw.png",
  Mercedes: "mercedes.png",
  Volkswagen: "volkswagen.png",
  Peugeot: "peugeot.png",
  Skoda: "skoda.png",
  Kia: "kia.png",
  Seat: "seat.png",
  Opel: "opel.png",
  Citroen: "citroen.png",
  Volvo: "volvo.png",
  Mazda: "mazda.png",
  Honda: "honda.png"
};


// Generate card HTML based on user inputs
const cardHTML = ({ brand, model, price, months, apr, itv }, idx) => {
  const pmt = monthlyPayment(price, apr, months);
  const days = daysUntil(itv);
  const safeBrand = titleCase(brand);
  const safeModel = titleCase(model);

  const logoFile = LOGOS[safeBrand] || "NewCar.jpg";

  return `
    <article class="card">
      <img src="assets/images/${logoFile}"
        alt="${safeBrand} logo" class="car-logo"/>
      <div class="meta">
        <h4>${safeBrand} ${safeModel}</h4>
        <div class="kpis">
          <span class="kpi">Price: ${euros(price)}</span>
          <span class="kpi">Estimated payment: ${euros(pmt.toFixed(2))}/mo</span>
          <span class="kpi">Term: ${months} months</span>
          <span class="kpi">APR: ${apr}%</span>
          ${days !== null ? `<span class="kpi">NCT/MOT in ${days} days</span>` : ``}
        </div>
        <div class="card-actions">
          <button class="btn danger small" data-del="${idx}">Delete</button>
        </div>
        <small class="muted">* Indicative calculation. Data is not stored yet.</small>
      </div>
    </article>
  `;
};

// Render all cards currently in the preview list
const renderAll = () => {
  if (previewCars.length === 0) {
    result.textContent = "Fill brand & model to see a preview.";
    clearAllBtn.style.display = "none";
    return;
  }
  clearAllBtn.style.display = "inline-block";
  result.innerHTML = previewCars.map((car, i) => cardHTML(car, i)).join("");
};

// Update months badge when slider moves
monthsEl.addEventListener("input", () => (monthsBadge.textContent = monthsEl.value));

// Add a new preview card
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const brand = brandEl.value.trim();
  const model = modelEl.value.trim();
  if (!brand || !model) {
    result.textContent = "Fill brand & model to see a preview.";
    return;
  }

  const newCar = {
    brand,
    model,
    price: Number(priceEl.value || 0),
    months: Number(monthsEl.value || 0),
    apr: Number(aprEl.value || 0),
    itv: itvEl.value,
  };

  previewCars.push(newCar);
  renderAll();

  form.reset();
  monthsBadge.textContent = monthsEl.value;
  brandEl.focus();
});

// "Clear => only resets form inputs"
resetBtn.addEventListener("click", () => {
  form.reset();
  monthsBadge.textContent = monthsEl.value;
});

// "Delete (event delegation)"
result.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-del]");
  if (!btn) return;
  const idx = Number(btn.dataset.del);
  if (!Number.isNaN(idx)) {
    previewCars.splice(idx, 1);
    renderAll();
  }
});

// "Clear all → removes all cars"
clearAllBtn.addEventListener("click", () => {
  previewCars = [];
  renderAll();
});

// GALLERY ROLLOVER
const galleryImg = document.querySelector("#galleryCar");

if (galleryImg) {
  const galleryFiles = [
    "YellowLamborghini.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg"
  ];

  let currentIndex = 0; // YellowLamborghini is the first picture

  galleryImg.addEventListener("mouseenter", () => {

        // Fade-out
        galleryImg.classList.remove("fade-in");
        galleryImg.classList.add("fade-out");

        // Wait animation
        setTimeout(() => {
            // Change image
            currentIndex = (currentIndex + 1) % galleryFiles.length;
            galleryImg.src = `assets/images/${galleryFiles[currentIndex]}`;

            // Fade-in
            galleryImg.classList.remove("fade-out");
            galleryImg.classList.add("fade-in");
        }, 550);
    });

}

// Initialize months badge and render
monthsBadge.textContent = monthsEl.value;
renderAll();
