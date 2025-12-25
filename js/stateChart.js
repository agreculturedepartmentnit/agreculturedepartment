async function loadStateData(){
  const res = await fetch("data/state_soil_proportion.json");
  return await res.json();
}

function drawBarChart(canvas, labels, values){
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // margins
  const m = {l:70, r:20, t:20, b:60};
  const cw = W - m.l - m.r;
  const ch = H - m.t - m.b;

  ctx.clearRect(0,0,W,H);

  // background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,W,H);

  // axes
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m.l, m.t);
  ctx.lineTo(m.l, m.t + ch);
  ctx.lineTo(m.l + cw, m.t + ch);
  ctx.stroke();

  const maxV = Math.max(...values, 1);
  const yMax = Math.ceil(maxV / 5) * 5; // nice top

  // grid + y labels
  ctx.fillStyle = "#4b5563";
  ctx.font = "12px system-ui, Arial";
  ctx.strokeStyle = "#e5e7eb";

  for(let i=0;i<=5;i++){
    const v = (yMax * i) / 5;
    const y = m.t + ch - (ch * i)/5;
    ctx.beginPath();
    ctx.moveTo(m.l, y);
    ctx.lineTo(m.l + cw, y);
    ctx.stroke();

    ctx.fillText(v.toFixed(0) + "%", 18, y+4);
  }

  // bars
  const gap = 14;
  const bw = (cw - gap*(labels.length+1)) / labels.length;

  for(let i=0;i<labels.length;i++){
    const x = m.l + gap + i*(bw+gap);
    const bh = (values[i] / yMax) * ch;
    const y = m.t + ch - bh;

    // bar
    ctx.fillStyle = "rgba(15,118,110,.55)";
    ctx.fillRect(x, y, bw, bh);

    // value
    ctx.fillStyle = "#111827";
    ctx.font = "12px system-ui, Arial";
    ctx.fillText(values[i].toFixed(2) + "%", x, y - 6);

    // label (rotate)
    ctx.save();
    ctx.translate(x + bw/2, m.t + ch + 40);
    ctx.rotate(-Math.PI/6);
    ctx.fillStyle = "#111827";
    ctx.font = "13px system-ui, Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  }

  // title
  ctx.fillStyle = "#111827";
  ctx.font = "bold 14px system-ui, Arial";
  ctx.fillText("Tamil Nadu – Soil Proportion (Sample)", m.l, 16);
}

(async function(){
  const canvas = document.getElementById("stateChart");
  if(!canvas) return;
  const data = await loadStateData();
  drawBarChart(canvas, data.map(d=>d.soil), data.map(d=>d.percent));
})();
