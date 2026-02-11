// ===== РАЗМЕРЫ КАРТЫ =====
const imageWidth = 8000;   // замени на реальные
const imageHeight = 6000;  // замени на реальные

// ===== СОЗДАНИЕ КАРТЫ =====
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 4,
  zoomSnap: 0.25
});

const bounds = [[0, 0], [imageHeight, imageWidth]];

L.imageOverlay('map.png', bounds).addTo(map);
map.fitBounds(bounds);
map.setMaxBounds(bounds);

// ===== КАТЕГОРИИ =====
const categories = {
  city: L.layerGroup(),
  dungeon: L.layerGroup(),
  event: L.layerGroup()
};

L.control.layers(null, {
  "🏙 Города": categories.city,
  "🏰 Подземелья": categories.dungeon,
  "✨ События": categories.event
}).addTo(map);

// ===== ЗАГРУЗКА ЛОКАЦИЙ =====
fetch('locations.json')
  .then(res => res.json())
  .then(locations => {
    locations.forEach(loc => {

      const imagesHTML = loc.images.map(img =>
        `<img src="${img}" onclick="openImage('${img}')">`
      ).join('');

      const popupContent = `
        <strong>${loc.name}</strong><br>
        <div class="popup-gallery">${imagesHTML}</div>
        <div>${loc.text}</div>
      `;

      const marker = L.marker(loc.coords)
        .bindPopup(popupContent, { maxWidth: 320 });

      marker.addTo(categories[loc.category]);
    });

    Object.values(categories).forEach(layer => layer.addTo(map));
  });

// ===== ОТКРЫТИЕ КАРТИНКИ =====
function openImage(src) {
  const popup = window.open("", "_blank");
  popup.document.write(`<img src="${src}" style="max-width:100%">`);
}

// ===========================
// ===== РЕЖИМ РЕДАКТИРОВАНИЯ =====
// ===========================

let editMode = false;
let tempLocations = [];

// Кнопка включения режима
const editButton = L.control({ position: "topleft" });

editButton.onAdd = function () {
  const btn = L.DomUtil.create("button", "");
  btn.innerHTML = "✏ Режим редактирования";

  btn.onclick = function () {
    editMode = !editMode;
    btn.style.background = editMode ? "#4caf50" : "white";
  };

  return btn;
};

editButton.addTo(map);

// Кнопка экспорта
const exportButton = L.control({ position: "topleft" });

exportButton.onAdd = function () {
  const btn = L.DomUtil.create("button", "");
  btn.innerHTML = "⬇ Скачать JSON";
  btn.style.marginTop = "5px";

  btn.onclick = function () {
    const dataStr = "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tempLocations, null, 2));

    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "locations.json");
    dl.click();
  };

  return btn;
};

exportButton.addTo(map);

// Клик по карте
map.on("click", function (e) {

  if (!editMode) return;

  const lat = Math.round(e.latlng.lat);
  const lng = Math.round(e.latlng.lng);

  const formHTML = `
    <div style="width:250px">
      <label>Название:</label><br>
      <input id="locName"><br>

      <label>Категория:</label><br>
      <select id="locCategory">
        <option value="city">Город</option>
        <option value="dungeon">Подземелье</option>
        <option value="event">Событие</option>
      </select><br>

      <label>Описание:</label><br>
      <textarea id="locText"></textarea><br>

      <label>Картинки (через запятую):</label><br>
      <input id="locImages"><br><br>

      <button onclick="saveLocation(${lat}, ${lng})">Сохранить</button>
    </div>
  `;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(formHTML)
    .openOn(map);
});

// Сохранение
function saveLocation(lat, lng) {

  const name = document.getElementById("locName").value;
  const category = document.getElementById("locCategory").value;
  const text = document.getElementById("locText").value;
  const imagesRaw = document.getElementById("locImages").value;

  const images = imagesRaw.split(",").map(i => i.trim()).filter(i => i);

  const newLocation = {
    name: name,
    category: category,
    coords: [lat, lng],
    images: images,
    text: text
  };

  tempLocations.push(newLocation);

  alert("Локация добавлена!");
  map.closePopup();
}
