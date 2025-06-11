const form = document.getElementById('search-form');
const input = document.getElementById('ip-input');
const ipDisplay = document.getElementById('ip-display');
const locationDisplay = document.getElementById('location-display');
const timezoneDisplay = document.getElementById('timezone-display');
const ispDisplay = document.getElementById('isp-display');

let map, marker;

function initMap(lat = 0, lng = 0) {
  if (!map) {
    map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]);
  }
}

async function fetchIPData(ip = '') {
  const url = ip
    ? `https://freeipapi.com/api/json/${ip}`
    : `https://freeipapi.com/api/json/`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Debug:
    console.log(data);

    // Update UI
    ipDisplay.textContent = data.ipAddress || 'N/A';
    locationDisplay.textContent = `${data.cityName}, ${data.regionName} ${data.zipCode}`;
    timezoneDisplay.textContent = `UTC ${data.timeZone}`;
    ispDisplay.textContent = data.isp || 'Unavailable';
    initMap(data.latitude, data.longitude);

  } catch (err) {
    console.error(err);
    alert("Invalid IP/domain or API error. Try again.");
  }
}

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) fetchIPData(query);
});

// Load user IP on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchIPData();
});
