async function loadDistrictIndex(){
  const res = await fetch("data/districts_index.json");
  return await res.json();
}

function render(rows){
  const tbody = document.querySelector("#districtTable tbody");
  tbody.innerHTML = "";
  for(const r of rows){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.district}</td>
      <td>${r.top_soil}</td>
      <td>
        <a href="districts/${r.slug}.html">Open</a>
        ${r.pdf ? ` • <a href="${r.pdf}" target="_blank" rel="noreferrer">PDF</a>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  }
}

(async function(){
  const q = document.getElementById("q");
  const all = await loadDistrictIndex();
  render(all);

  q.addEventListener("input", ()=>{
    const s = q.value.trim().toLowerCase();
    const filtered = all.filter(d => d.district.toLowerCase().includes(s));
    render(filtered);
  });
})();
