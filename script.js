document.addEventListener('DOMContentLoaded', () => {
    // Initialize map centered on India (or your preferred default)
    const map = L.map('map').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Variable to store the routing control so we can remove the old line before drawing a new one
    let routingControl = null;

    document.getElementById('routeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        calculateRoute();
    });

    function calculateRoute() {
        const startInput = document.getElementById('start').value;
        const endInput = document.getElementById('end').value;

        const start = startInput.split(',');
        const end = endInput.split(',');

        const startLatLng = L.latLng(parseFloat(start[0]), parseFloat(start[1]));
        const endLatLng = L.latLng(parseFloat(end[0]), parseFloat(end[1]));

        // If a previous route exists, remove it from the map
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [startLatLng, endLatLng],
            routeWhileDragging: true,
            showAlternatives: true,
            lineOptions: {
                styles: [{color: '#3498db', opacity: 0.7, weight: 6}] // Aesthetic blue line
            },
            createMarker: function(i, waypoint, n) {
                // Use standard markers, or customize them here if needed
                return L.marker(waypoint.latLng);
            }
        })
        .on('routesfound', function(e) {
            // Extract Data for our Custom Dashboard
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Update the UI box with distance (converted to km) and time (converted to minutes)
            document.getElementById('distance-val').textContent = (summary.totalDistance / 1000).toFixed(1) + " km";
            document.getElementById('time-val').textContent = Math.round(summary.totalTime / 60) + " min";
        })
        .addTo(map);
    }
});