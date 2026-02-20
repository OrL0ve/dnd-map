

// === размеры основной карты ===
const width = 4028;
const height = 2494;

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2
});

// границы карты
const bounds = [[0,0], [height, width]];

// добавляем фон
L.imageOverlay('map4028x2494.jpg', bounds).addTo(map);
map.fitBounds(bounds);


// ===============================
// РЕГИОН КАМЕННЫЙ ПРЕДЕЛ
// ===============================

// !!! ВАЖНО !!!
// Здесь нужно указать реальные координаты региона
// Пример (ты поменяешь их под свой регион)
const kpBounds = [[900, 600], [1650, 1400]];

// overlay подсветки
const kpHighlight = L.imageOverlay('KPSelection.png', kpBounds, {
    opacity: 0
}).addTo(map);

// hover эффект
kpHighlight.on('mouseover', function () {
    this.setOpacity(0.8);
});

kpHighlight.on('mouseout', function () {
    this.setOpacity(0);
});

// клик — открыть карту региона
kpHighlight.on('click', function () {
    window.open('KPRegMap.html', '_blank');
});

</script>
</body>
</html>

