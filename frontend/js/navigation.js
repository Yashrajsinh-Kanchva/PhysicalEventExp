import { SECTIONS, GATES } from './heatmap.js';

export function initNavigation() {
    const form = document.getElementById('seatForm');
    if (!form) return;

    // Load saved
    const uGate = localStorage.getItem('targetGate');
    const uSec = localStorage.getItem('targetSection');
    if (uGate) document.getElementById('gateSelect').value = uGate;
    if (uSec) document.getElementById('sectionSelect').value = uSec;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const g = document.getElementById('gateSelect').value;
        const s = document.getElementById('sectionSelect').value;
        localStorage.setItem('targetGate', g);
        localStorage.setItem('targetSection', s);
        
        updateDistanceInfo(g, s);
        // Dispatch event for heatmap redraw
        window.dispatchEvent(new Event('navigationUpdate'));
    });

    if (uGate && uSec) updateDistanceInfo(uGate, uSec);
}

function updateDistanceInfo(g, s) {
    const gateObj = GATES.find(gt => gt.name === g);
    if (!gateObj) return;

    // Scale logic placeholder (matches heatmap.js layout)
    const canvas = document.getElementById('findSeatCanvas');
    if (!canvas) return;
    
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const scaleFactor = Math.min(w / 1000, h / 700) * 1.3;
    const secOuterRX = 280 * scaleFactor, secOuterRY = 220 * scaleFactor;
    const secInnerRX = 180 * scaleFactor, secInnerRY = 140 * scaleFactor;

    const gx = cx + Math.cos(gateObj.angle) * (secOuterRX + 40);
    const gy = cy + Math.sin(gateObj.angle) * (secOuterRY + 40);
    
    const secIndex = SECTIONS.indexOf(s);
    const secMidA = (secIndex * (Math.PI*2)/SECTIONS.length) - Math.PI/2 + Math.PI/SECTIONS.length;
    const sx = cx + Math.cos(secMidA) * (secInnerRX + (secOuterRX - secInnerRX)/2);
    const sy = cy + Math.sin(secMidA) * (secInnerRY + (secOuterRY - secInnerRY)/2);
    
    const pxDist = Math.hypot(sx - gx, sy - gy);
    const distanceMeters = Math.floor(pxDist / 10) * 10; 
    
    const display = document.getElementById('distanceDisplay');
    if (display) {
        display.innerHTML = `
            <div class="text-slate-400 text-sm mb-1 uppercase tracking-tighter">Estimated Distance</div>
            <div class="text-3xl font-black text-cyan-400">~${distanceMeters}m</div>
        `;
        display.classList.remove('opacity-0');
    }
}
