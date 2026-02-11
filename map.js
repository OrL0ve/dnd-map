// Размеры твоей карты (ВАЖНО — поменяй если другие!)
const imageWidth = 8192;
const imageHeight = 5788;

// Создаем карту
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2
});

// Границы изображения
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Добавляем изображение карты
L.imageOverlay('map.png', bounds).addTo(map);

// Устанавливаем границы
map.fitBounds(bounds);

// Цвета категорий
function getMarkerColor(category) {
    switch (category) {
        case "Города": return "red";
        case "Подземелья": return "black";
        case "Руины": return "purple";
        case "События": return "green";
        default: return "blue";
    }
}

// Загрузка локаций
fetch('locations.json')
.then(response => response.json())
.then(locations => {

    locations.forEach(loc => {

        const marker = L.circleMarker([loc.y, loc.x], {
            radius: 8,
            fillColor: getMarkerColor(loc.category),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(map);

        marker.on('click', () => {
            openSidebar(loc);
            map.setView([loc.y, loc.x], map.getZoom());
        });

    });

});

// Sidebar логика
function openSidebar(loc) {

    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("sidebarContent");

    let html = `<h2>${loc.title}</h2>`;
    html += `<p><strong>${loc.category}</strong></p>`;
    html += `<p>${loc.description}</p>`;

    if (loc.images && loc.images.length > 0) {
        loc.images.forEach(img => {
            html += `<img src="${img}">`;
        });
    }

    content.innerHTML = html;
    sidebar.classList.add("open");
}

document.getElementById("closeSidebar").onclick = function() {
    document.getElementById("sidebar").classList.remove("open");
};
