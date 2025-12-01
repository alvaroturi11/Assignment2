const $ = (sel) => document.querySelector(sel);
const titleCase = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, " ")
    .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

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

const form = $("#addCarForm");
const tableBody = $("#carsBody");
const countLabel = $("#countLabel");
const table = $("#carsTable");

const filterBody = $("#filterBody");
const searchOut = $("#searchOutput");

const makeInput = $("#make");
const modelInput = $("#model");
const modelList = $("#modelList");

const searchRegEl = $("#searchReg");
const searchMakeEl = $("#searchMake");
const searchColourEl = $("#searchColour");

const btnFind = $("#btnFind");
const btnFilter = $("#btnFilter");
const btnClearSearch = $("#btnClearSearch");

// ---------- Display Records in the main table ----------
const displayRecs = () => {
  tableBody.textContent = "";
  if (cars.length === 0) {
    countLabel.textContent = "No cars in the array.";
    return;
  }
  cars.forEach(car => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${car.regNo}</td>
        <td>${car.make}</td>
        <td>${car.model}</td>
        <td>${car.colour}</td>
        <td>${car.fuelType}</td>
        <td>${car.seats}</td>
        <td><button class="btn" data-id="${car.regNo}">Delete</button></td>
      </tr>`
    );
  });
  countLabel.textContent = `Total records: ${cars.length}`;
};

// ---------- Make/Model dynamic behavior ----------
const populateModelsForMake = (make) => {
  modelList.textContent = "";
  const models = MODELS[titleCase(make)] || [];
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    modelList.appendChild(opt);
  });
  modelInput.value = "";
  modelInput.disabled = models.length === 0;
  if (models.length > 0) modelInput.placeholder = "Pick a model…";
  else modelInput.placeholder = "Select a make first";
};

// When user types/changes make, rebuild the model list
["input", "change"].forEach(ev =>
  makeInput.addEventListener(ev, () => populateModelsForMake(makeInput.value))
);

// ---------- Add a Record ----------
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const reg = form.elements.reg.value.trim();
  const make = titleCase(form.elements.make.value);
  const model = form.elements.model.value.trim();
  const colour = titleCase(form.elements.colour.value);
  const fuelType = form.elements.fuelType.value;
  const seats = Number(form.elements.seats.value);


  if (!reg || !make || !model) {
    alert("Please complete Registration, Make and Model.");
    return;
  }

  // Ensure model belongs to selected make
  const allowedModels = MODELS[make] || [];
  if (!allowedModels.includes(model)) {
    alert(`Model must belong to ${make}. Allowed: ${allowedModels.join(", ") || "—"}`);
    return;
  }

  // Prevent duplicate regNo
  const exists = cars.some(c => c.regNo.toLowerCase() === reg.toLowerCase());
  if (exists) { alert("A car with that Registration Number already exists."); return; }

  const newcar = { regNo: reg, make, model, colour, fuelType, seats };
  cars.push(newcar);
  displayRecs();

  // Notification: "Car added!"
  const toast = document.createElement("div");
  toast.textContent = "Car added!";
  toast.className = "toast add";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1500);

  form.reset();
  populateModelsForMake("");     // disable Model again until a make is chosen
  form.elements[0].focus();
});

// ---------- Delete a record (event delegation on the table) ----------
table.addEventListener("click", (evt) => {
  if (!evt.target.matches("button[data-id]")) return;
  const id = evt.target.dataset.id;
  const idx = cars.findIndex(car => car.regNo.toLowerCase() === id.toLowerCase());
  if (idx >= 0) {
    cars.splice(idx, 1);
    displayRecs();

    // Notification: "Car deleted!"
    const toast = document.createElement("div");
    toast.textContent = "Car deleted!";
    toast.className = "toast delete";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 1500);

    renderFilterResults([]);
    searchOut.textContent = "";
  }
});

// ---------- Search: find() ----------
btnFind.addEventListener("click", () => {
  const q = (searchRegEl.value || "").toLowerCase().trim();
  if (!q) { searchOut.textContent = "Type a registration to search."; return; }

  const car = cars.find(c => c.regNo.toLowerCase() === q);
  searchOut.innerHTML = car
    ? `Found: <strong>${car.make} ${car.model}</strong> — ${car.colour}`
    : "No car found with that registration.";

  // Reset and refocus the input
  searchRegEl.value = "";
  searchRegEl.focus();
});

// Allow pressing Enter to trigger "Find"
searchRegEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnFind.click();
  }
});

// ---------- Search: filter() by make (and optional colour) ----------
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

btnFilter.addEventListener("click", () => {
  const make = (searchMakeEl.value || "").toLowerCase().trim();
  const colour = (searchColourEl.value || "").toLowerCase().trim();

  if (!make) {
    renderFilterResults([]);
    searchOut.textContent = "Type a make to filter.";
    return;
  }

  const all = cars.filter(car => {
    const okMake = car.make.toLowerCase() === make;
    const okColour = colour ? car.colour.toLowerCase() === colour : true;
    return okMake && okColour;
  });

  renderFilterResults(all);
  searchOut.textContent = all.length
    ? `Filter results: ${all.length}`
    : "No records found for that criteria.";
});

// ---------- Clear search inputs and results ----------
btnClearSearch.addEventListener("click", () => {
  searchRegEl.value = "";
  searchMakeEl.value = "";
  searchColourEl.value = "";
  searchOut.textContent = "";
  renderFilterResults([]);
  searchRegEl.focus();
});

// ---------- Init ----------
displayRecs();
populateModelsForMake(""); // Model deshabilitado al inicio
