// Track scan history
const scanHistory = [];

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(a => a.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  document.getElementById("nav-" + sectionId).classList.add("active");
}

function previewFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const wrap = document.getElementById("previewWrap");
  const img = document.getElementById("previewImg");
  img.src = URL.createObjectURL(file);
  wrap.classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
}

function clearImage() {
  document.getElementById("imageInput").value = "";
  document.getElementById("previewWrap").classList.add("hidden");
  document.getElementById("previewImg").src = "";
  document.getElementById("result").classList.add("hidden");
}

async function uploadImage() {
  const input = document.getElementById("imageInput");
  if (input.files.length === 0) {
    alert("Please upload an image first.");
    return;
  }

  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // Show loader, hide result
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  try {
    const response = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    document.getElementById("loading").classList.add("hidden");
    displayResult(data, file);

  } catch (error) {
    document.getElementById("loading").classList.add("hidden");
    alert("Could not connect to backend. Make sure python main.py is running on port 8000.");
    console.error(error);
  }
}

function displayResult(data, file) {
  const resultCard = document.getElementById("result");
  const plateEl = document.getElementById("plate");
  const vehicleInfoEl = document.getElementById("vehicleInfo");
  const statusBadge = document.getElementById("statusBadge");
  const notFoundMsg = document.getElementById("notFoundMsg");

  resultCard.classList.remove("hidden");
  notFoundMsg.classList.add("hidden");
  vehicleInfoEl.innerHTML = "";

  if (!data.success) {
    plateEl.textContent = "ERROR";
    statusBadge.textContent = "FAILED";
    statusBadge.className = "badge unknown";
    vehicleInfoEl.innerHTML = `<div class="info-row" style="grid-column:1/-1"><div class="info-label">ERROR</div><div class="info-value">${data.error || "Unknown error"}</div></div>`;
    return;
  }

  // Plate number
  plateEl.textContent = data.plate_number || "—";

  const info = data.vehicle_info;

  if (!data.vehicle_found_in_db || !info) {
    // Plate detected but not in DB
    statusBadge.textContent = "NOT IN DATABASE";
    statusBadge.className = "badge unknown";
    notFoundMsg.classList.remove("hidden");

    // Show raw OCR at least
    if (data.raw_ocr_text) {
      vehicleInfoEl.innerHTML = `
        <div class="info-row" style="grid-column:1/-1">
          <div class="info-label">RAW OCR OUTPUT</div>
          <div class="info-value">${data.raw_ocr_text}</div>
        </div>`;
    }
  } else {
    // Full vehicle info available
    const status = info.status || "Unknown";
    statusBadge.textContent = status.toUpperCase();
    statusBadge.className = "badge " + (status.toLowerCase() === "valid" ? "valid" : "expired");

    vehicleInfoEl.innerHTML = `
      <div class="info-row">
        <div class="info-label">OWNER</div>
        <div class="info-value">${info.owner || "—"}</div>
      </div>
      <div class="info-row">
        <div class="info-label">VEHICLE</div>
        <div class="info-value">${info.vehicle || "—"}</div>
      </div>
      <div class="info-row">
        <div class="info-label">COLOR</div>
        <div class="info-value">${info.color || "—"}</div>
      </div>
      <div class="info-row">
        <div class="info-label">YEAR</div>
        <div class="info-value">${info.year || "—"}</div>
      </div>
      <div class="info-row">
        <div class="info-label">STATE</div>
        <div class="info-value">${info.state || "—"}</div>
      </div>
      <div class="info-row">
        <div class="info-label">FUEL TYPE</div>
        <div class="info-value">${info.fuel_type || "—"}</div>
      </div>`;
  }

  // Add to history
  addToHistory(data);
}

function addToHistory(data) {
  scanHistory.unshift(data);
  const container = document.getElementById("historyContainer");
  const emptyMsg = container.querySelector(".empty-msg");
  if (emptyMsg) emptyMsg.remove();

  const info = data.vehicle_info;
  const status = info ? info.status : null;
  const time = new Date().toLocaleTimeString();

  const item = document.createElement("div");
  item.classList.add("history-item");
  item.innerHTML = `
    <div>
      <div class="history-plate">${data.plate_number || "UNKNOWN"}</div>
      <div class="history-meta">${info ? info.vehicle : "Not in database"}</div>
    </div>
    <div class="history-meta" style="text-align:right">
      <div class="history-status ${status ? status.toLowerCase() : ''}">${status ? status.toUpperCase() : "NOT FOUND"}</div>
      <div>${time}</div>
    </div>`;
  container.prepend(item);
}
