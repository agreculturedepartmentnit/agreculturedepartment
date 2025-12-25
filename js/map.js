const map = L.map("map").setView([11.0, 78.0], 7);

// Base map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let districtsLayer = null;
let soilWmsLayer = null;

// District -> PDF (optional). Add official PDF links here when you collect them.
const districtPdf = {
  "ARIYALUR": "",
  "COIMBATORE": "",
  "THANJAVUR": ""
};

function slugify(s){
  return (s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

function showDistrictInfo(name) {
  const box = document.getElementById("districtInfo");
  const key = (name || "").toUpperCase().trim();
  const pdf = districtPdf[key];
  const slug = slugify(name);

  box.innerHTML = `
    <h3 style="margin:0 0 6px">${name}</h3>
    <p class="small">Open the detailed district page for soil summary and (optional) PDF reference.</p>
    ${pdf ? `<p><a href="${pdf}" target="_blank" rel="noreferrer">Open Soil Atlas PDF</a></p>` : `<p class="small"><em>PDF link not added yet.</em></p>`}
    <p><a href="districts/${slug}.html">Open district page →</a></p>
  `;
}

// Load district boundaries GeoJSON
fetch("data/tn_districts.geojson")
  .then(r => r.json())
  .then(geo => {
    districtsLayer = L.geoJSON(geo, {
      style: { weight: 1, fillOpacity: 0.08 },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.district || feature.properties?.DISTRICT || feature.properties?.name || "Unknown";
        layer.on("click", () => showDistrictInfo(name));
      }
    }).addTo(map);

    map.fitBounds(districtsLayer.getBounds());
  });

// Optional: Soil WMS placeholder toggle
function enableSoilWms(enable) {
  if (enable) {
    // TODO: Replace with a real WMS URL and layer name when you choose a soil WMS service.
    soilWmsLayer = L.tileLayer.wms("https://example.com/geoserver/wms", {
      layers: "SOIL_LAYER_NAME",
      format: "image/png",
      transparent: true
    });
    soilWmsLayer.addTo(map);
  } else if (soilWmsLayer) {
    map.removeLayer(soilWmsLayer);
    soilWmsLayer = null;
  }
}

document.getElementById("districtLayer").addEventListener("change", (e) => {
  if (!districtsLayer) return;
  if (e.target.checked) districtsLayer.addTo(map);
  else map.removeLayer(districtsLayer);
});

document.getElementById("soilLayer").addEventListener("change", (e) => {
  enableSoilWms(e.target.checked);
});
