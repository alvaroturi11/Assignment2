const titleCase = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, " ")
    .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const showToast = (msg, type) => {
  const t = document.createElement("div");
  t.textContent = msg;
  t.className = `toast ${type}`; // .toast.add o .toast.delete
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
};

const MODELS = {
  Ford: ['Escort', 'Focus', 'Fiesta', 'Mondeo', 'Puma', 'Kuga', 'Mustang'],
  Hyundai: ['Kona', 'Tucson', 'i10', 'i20', 'i30', 'Santa Fe', 'Ioniq 5'],
  Toyota: ['Corolla', 'C-HR', 'Yaris', 'RAV4', 'Camry', 'Prius', 'Auris'],
  Renault: ['Captur', 'Megane', 'Clio', 'Kadjar', 'Arkana', 'Austral'],
  Nissan: ['Qashqai', 'Juke', 'Micra', 'X-Trail', 'Leaf', 'Ariya'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Audi: ['A1', 'A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8'],
  Cupra: ['Born', 'Leon', 'Formentor', 'Terramar', 'Tavascan'],
  Fiat: ['500', '500X', 'Panda', 'Tipo', 'Punto', 'Doblo'],
  Bmw: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', 'X1', 'X3', 'X5'],
  Mercedes: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE'],
  Volkswagen: ['Polo', 'Golf', 'T-Roc', 'Tiguan', 'Passat', 'ID.4'],
  Peugeot: ['208', '2008', '3008', '308', '5008', '508'],
  Skoda: ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Kodiaq'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Sportage', 'EV6'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  Opel: ['Corsa', 'Astra', 'Crossland', 'Mokka', 'Grandland'],
  Citroen: ['C1', 'C3', 'C4', 'C5 Aircross', 'Berlingo'],
  Volvo: ['XC40', 'XC60', 'XC90', 'S60', 'V60', 'C40'],
  Mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'MX-30'],
  Honda: ['Jazz', 'Civic', 'HR-V', 'CR-V']
};

const hbMakeInput = document.querySelector("#hbMake");
const hbModelInput = document.querySelector("#hbModel");
const hbModelList = document.querySelector("#hbModelList");

const populateModelsForMakeHb = (make) => {
  hbModelList.textContent = "";
  const models = MODELS[titleCase(make)] || [];
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    hbModelList.appendChild(opt);
  });
  hbModelInput.value = "";
  hbModelInput.disabled = models.length === 0;
  hbModelInput.placeholder = models.length > 0 ? "Pick a model…" : "Select a make first";
};

["input", "change"].forEach(ev =>
  hbMakeInput.addEventListener(ev, () => populateModelsForMakeHb(hbMakeInput.value))
);
populateModelsForMakeHb("");

// LocalStorage
const STORAGE_KEY = "ds-handle-cars";

const loadGarage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      console.warn("Error parsing localStorage data, resetting.", err);
    }
  }
  // If nothing is saved, we start with cars[] from cars-data.js
  return Array.isArray(cars) ? [...cars] : [];
};

let garage = loadGarage();

const saveGarage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(garage));
};

// Handlebars
const rowTemplateSrc = document.querySelector("#cars-template").innerHTML;
const rowTemplate = Handlebars.compile(rowTemplateSrc);

// Elementos DOM principales
const hbForm = document.querySelector("#hbAddForm");
const carsBody = document.querySelector("#hbCarsBody");
const countLabel = document.querySelector("#hbCountLabel");
const filterBody = document.querySelector("#hbFilterBody");

const searchRegEl = document.querySelector("#hbSearchReg");
const searchMakeEl = document.querySelector("#hbSearchMake");
const searchColourEl = document.querySelector("#hbSearchColour");
const searchOut = document.querySelector("#hbSearchOutput");

// Cars table
const render = () => {
  carsBody.innerHTML = rowTemplate({ cars: garage });

  if (garage.length === 0) {
    countLabel.textContent = "No cars in the array.";
  } else {
    countLabel.textContent = `Total records: ${garage.length}`;
  }
};

// Filter table
const renderFilterResults = (arr) => {
  filterBody.textContent = "";
  arr.forEach(car => {
    filterBody.insertAdjacentHTML("beforeend",
      `<tr>
        <td>${car.regNo}</td>
        <td>${car.make}</td>
        <td>${car.model}</td>
        <td>${car.colour}</td>
        <td>${car.fuelType}</td>
        <td>${car.seats}</td>
      </tr>`
    );
  });
};

saveGarage();
render();
renderFilterResults([]);

// Add car
hbForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const regNo = hbForm.regNo.value.trim();
  const make = titleCase(hbForm.make.value);
  const model = hbForm.model.value.trim();
  const colour = titleCase(hbForm.colour.value);
  const fuelType = hbForm.fuelType.value;
  const seats = Number(hbForm.seats.value);

  if (!regNo || !make || !model) {
    alert("Please fill in Registration, Make and Model.");
    return;
  }

  const allowedModels = MODELS[make] || [];
  if (!allowedModels.includes(model)) {
    alert(`Model must belong to ${make}. Allowed: ${allowedModels.join(", ") || "—"}`);
    return;
  }

  const exists = garage.some(
    (c) => c.regNo.toLowerCase() === regNo.toLowerCase()
  );
  if (exists) {
    alert("A car with that Registration Number already exists.");
    return;
  }

  const newCar = { regNo, make, model, colour, fuelType, seats };

  garage.push(newCar);
  saveGarage();
  render();
  renderFilterResults([]);

  hbForm.reset();
  populateModelsForMakeHb("");
  hbForm.regNo.focus();

  showToast("Car added!", "add");
});

// Delete car
carsBody.addEventListener("click", (evt) => {
  const btn = evt.target.closest("button[data-del]");
  if (!btn) return;

  const reg = btn.dataset.del.toLowerCase();
  garage = garage.filter((c) => c.regNo.toLowerCase() !== reg);
  saveGarage();
  render();
  renderFilterResults([]);
  searchOut.textContent = "";

  showToast("Car deleted!", "delete");
});

// Search: find by registration
document.querySelector("#hbBtnFind").addEventListener("click", () => {
  const q = (searchRegEl.value || "").trim().toLowerCase();
  if (!q) {
    searchOut.textContent = "Type a registration to search.";
    return;
  }

  const car = garage.find((c) => c.regNo.toLowerCase() === q);
  if (car) {
    searchOut.innerHTML = `Found: <strong>${car.make} ${car.model}</strong> — ${car.colour}`;
  } else {
    searchOut.textContent = "No car found with that registration.";
  }
});

// Search: filter by make + optional colour
document.querySelector("#hbBtnFilter").addEventListener("click", () => {
  const make = (searchMakeEl.value || "").trim().toLowerCase();
  const colour = (searchColourEl.value || "").trim().toLowerCase();

  if (!make) {
    searchOut.textContent = "Type a make to filter.";
    renderFilterResults([]);
    return;
  }

  const filtered = garage.filter((c) => {
    const okMake = c.make.toLowerCase() === make;
    const okColour = colour ? c.colour.toLowerCase() === colour : true;
    return okMake && okColour;
  });

  searchOut.textContent = filtered.length
    ? `Filter results: ${filtered.length}`
    : "No records found for that criteria.";

  renderFilterResults(filtered);
});

// Clear search
document.querySelector("#hbBtnClear").addEventListener("click", () => {
  searchRegEl.value = "";
  searchMakeEl.value = "";
  searchColourEl.value = "";
  searchOut.textContent = "";
  renderFilterResults([]);
});

// Save / Load dataset
const saveBtn = document.querySelector("#saveBtn");
const loadBtn = document.querySelector("#loadBtn");

saveBtn.addEventListener("click", () => {
  saveGarage();
  alert("Dataset saved to LocalStorage.");
});

loadBtn.addEventListener("click", () => {
  garage = loadGarage();
  render();
  renderFilterResults([]);
  alert("Dataset loaded from LocalStorage.");
});
