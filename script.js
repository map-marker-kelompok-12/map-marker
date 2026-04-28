// =======================
// MEMBUAT MAP
// =======================

var map = L.map('map');


// =======================
// PILIHAN TILE MAP
// =======================

// Map standar
var osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
);

// Satelit
var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
    'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles © Esri'
    }
);

// Terrain
var terrain = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenTopoMap contributors'
    }
);

// Default layer
osm.addTo(map);


// Layer control
var baseMaps = {
    "Map Standar": osm,
    "Satelit": satellite,
    "Terrain": terrain
};

L.control.layers(baseMaps).addTo(map);



// =======================
// DATA LOKASI KAMPUS
// =======================

var locations = [
    {
        name: "Universitas Syiah Kuala",
        lat: 5.570555463202361,
        lng: 95.36976202928632
    },  
    {
        name: "UIN Ar-Raniry",
        lat: 5.5783773329962045,
        lng: 95.36685982405892
    },
    {
        name: "Universitas Bina Bangsa Getsempena",
        lat: 5.5805599812709445,
        lng: 95.35782300725448
    },
    {
        name: "Universitas Ubudiyah Indonesia",
        lat: 5.586646762542887,
        lng: 95.35136178076372
    },
    {
        name: "Rumah Reky",
        lat: 5.596088234003062,  
        lng: 95.36705725683282
    },
    {
        name: "Gudang Cafe ",
        lat: 5.571526326384845, 
        lng: 95.34967679689862
    },
    {
        name: "Rumah Panjul",
        lat: 5.577195064866737,  
        lng: 95.34617953924801
    },
    {
        name: "Masjid Jamik Baitul Ahad",
        lat: 5.576302089835663,   
        lng: 95.39748340107958
    }
    
];



// =======================
// SIDEBAR
// =======================

var list = document.getElementById("locationList");


// Untuk menyimpan semua marker
var markers = [];

// Untuk menghitung batas map
var bounds = [];



// =======================
// LOOP MARKER
// =======================

locations.forEach(function(loc) {

    // Buat marker
    var marker = L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup("<b>" + loc.name + "</b>");

    markers.push(marker);

    bounds.push([loc.lat, loc.lng]);



    // Buat item sidebar
    var li = document.createElement("li");

    li.textContent = loc.name;



    // Saat diklik
    li.onclick = function() {

        // Pindahkan map ke tengah
        map.flyTo(
            [loc.lat, loc.lng],
            16,
            {
                duration: 1.5
            }
        );

        marker.openPopup();

    };

    list.appendChild(li);

});



// =======================
// ZOOM OTOMATIS KE SEMUA MARKER
// =======================

map.fitBounds(bounds);

// =======================
// FITUR LOKASI SAYA
// =======================

var userMarker = null;

document.getElementById("btnLocation").onclick = function() {

    // Cek apakah browser support GPS
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            
            function(position) {

                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                // Hapus marker lama jika ada
                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                // Buat marker lokasi user
                userMarker = L.marker([userLat, userLng])
                    .addTo(map)
                    .bindPopup("📍 Lokasi Anda")
                    .openPopup();

                // Pindah map ke lokasi user
                map.flyTo(
                    [userLat, userLng],
                    16,
                    {
                        duration: 1.5
                    }
                );

            },

            function(error) {

                alert(
                    "Tidak dapat mengambil lokasi.\n" +
                    "Pastikan GPS diaktifkan."
                );

            }

        );

    } else {

        alert("Browser tidak mendukung Geolocation.");

    }

};