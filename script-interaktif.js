// =======================
// MAP MARKER INTERAKTIF & MODERN
// =======================

var list = document.getElementById("locationList");
var detailBox = document.getElementById("locationDetail");
var searchBox = document.getElementById("searchBox");
var snackbar = document.getElementById("snackbar");

// Untuk menyimpan semua marker
var markers = [];
var markerRefs = {};
// Untuk menghitung batas map
var bounds = [];
var activeIndex = null;

function renderLocations(filter = "") {
    list.innerHTML = "";
    locations.forEach(function(loc, idx) {
        if (filter && !loc.name.toLowerCase().includes(filter.toLowerCase())) return;
        var li = document.createElement("li");
        li.innerHTML = `<span style='font-size:18px;'>📌</span> <span>${loc.name}</span>`;
        if (activeIndex === idx) li.classList.add("active");
        li.onclick = function() {
            setActiveLocation(idx);
        };
        list.appendChild(li);
    });
}

function setActiveLocation(idx) {
    activeIndex = idx;
    renderLocations(searchBox.value);
    var loc = locations[idx];
    var marker = markers[idx];
    map.flyTo([loc.lat, loc.lng], 16, {duration: 1.5});
    marker.openPopup();
    // Tampilkan detail
    detailBox.style.display = "block";
    detailBox.innerHTML = `<b>${loc.name}</b><br>Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`;
    // Highlight marker
    markers.forEach((m, i) => {
        if (i === idx) m.setIcon(highlightIcon);
        else m.setIcon(defaultIcon);
    });
}

// Custom marker icon
var defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});
var highlightIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 41],
    iconAnchor: [16, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

locations.forEach(function(loc, idx) {
    var marker = L.marker([loc.lat, loc.lng], {icon: defaultIcon})
        .addTo(map)
        .bindPopup("<b>" + loc.name + "</b>");
    markers.push(marker);
    markerRefs[loc.name] = marker;
    bounds.push([loc.lat, loc.lng]);
    marker.on('click', function() {
        setActiveLocation(idx);
    });
});

renderLocations();

searchBox.addEventListener('input', function() {
    renderLocations(this.value);
    detailBox.style.display = "none";
    activeIndex = null;
    // Reset marker icon
    markers.forEach(m => m.setIcon(defaultIcon));
});

map.fitBounds(bounds);

var userMarker = null;
function showSnackbar(msg) {
    snackbar.textContent = msg;
    snackbar.className = "show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 2500);
}
document.getElementById("btnLocation").onclick = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                userMarker = L.marker([userLat, userLng], {
                    icon: L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                        iconSize: [32, 41],
                        iconAnchor: [16, 41],
                        popupAnchor: [1, -34],
                        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                        shadowSize: [41, 41]
                    })
                })
                .addTo(map)
                .bindPopup("📍 Lokasi Anda")
                .openPopup();
                map.flyTo([userLat, userLng], 16, {duration: 1.5});
                showSnackbar("Lokasi Anda berhasil ditemukan!");
            },
            function(error) {
                showSnackbar("Tidak dapat mengambil lokasi. Pastikan GPS diaktifkan.");
            }
        );
    } else {
        showSnackbar("Browser tidak mendukung Geolocation.");
    }
};
