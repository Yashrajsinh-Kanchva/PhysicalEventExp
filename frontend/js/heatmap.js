import { getStatusInfo } from './utils.js';

export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
export const GATES = [
    { name: 'Gate 1', angle: -Math.PI / 2 },
    { name: 'Gate 2', angle: 0 },
    { name: 'Gate 3', angle: Math.PI / 2 },
    { name: 'Gate 4', angle: Math.PI }
];

export const STATIC_ICONS = [
    { type: 'food', label: 'Food Court A', angle: -Math.PI / 4, icon: '🍔' },
    { type: 'food', label: 'Food Court B', angle: Math.PI / 4, icon: '🍔' },
    { type: 'food', label: 'Food Court C', angle: Math.PI, icon: '🍔' },
    { type: 'restroom', label: 'Men 1', angle: -Math.PI / 6, icon: '🚻' },
    { type: 'restroom', label: 'Men 2', angle: 5 * Math.PI / 6, icon: '🚻' },
    { type: 'restroom', label: 'Women 1', angle: 7 * Math.PI / 6, icon: '🚻' },
    { type: 'restroom', label: 'Women 2', angle: -5 * Math.PI / 6, icon: '🚻' },
    { type: 'merch', label: 'Store 1', angle: 2 * Math.PI / 3, icon: '🛍️' },
    { type: 'merch', label: 'Store 2', angle: -2 * Math.PI / 3, icon: '🛍️' }
];

let animFrameId = null;
let canvasZones = [];
let hoverState = null;
let crowdDataCache = null;

export function startCanvasAnimation(canvasId, mode = 'heatmap', data = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    crowdDataCache = data;

    setupCanvasInteraction(canvas);

    const renderLoop = (timestamp) => {
        const rect = canvas.parentElement.getBoundingClientRect();
        if (canvas.width !== Math.floor(rect.width)) canvas.width = Math.floor(rect.width);
        if (canvas.height !== Math.floor(rect.height) && canvas.height < 800) canvas.height = 800;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        drawStructuredStadium(ctx, canvas.width, canvas.height, timestamp, mode);
        ctx.restore();
        
        animFrameId = requestAnimationFrame(renderLoop);
    };

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(renderLoop);
}

function drawStructuredStadium(ctx, w, h, timestamp, mode) {
    const cx = w / 2;
    const cy = h / 2;
    canvasZones = [];

    const scaleFactor = Math.min(w / 1100, h / 850) * 1.0;

    const pitchRX = 120 * scaleFactor, pitchRY = 80 * scaleFactor;
    const walkRX = 155 * scaleFactor, walkRY = 115 * scaleFactor;
    const secInnerRX = 180 * scaleFactor, secInnerRY = 140 * scaleFactor;
    const secOuterRX = 280 * scaleFactor, secOuterRY = 220 * scaleFactor;

    // Background Depth
    const bgGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 500 * scaleFactor);
    bgGrd.addColorStop(0, 'rgba(0, 229, 255, 0.02)');
    bgGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = bgGrd;
    ctx.fillRect(0,0,w,h);

    // 1. Inner Ground (Pitch)
    const pitchGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, pitchRX);
    pitchGrd.addColorStop(0, '#0a1a0a');
    pitchGrd.addColorStop(1, '#112211');
    ctx.fillStyle = pitchGrd;
    ctx.beginPath(); ctx.ellipse(cx, cy, pitchRX, pitchRY, 0, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)'; ctx.lineWidth = 2; ctx.stroke();
    
    // 2. Sections
    SECTIONS.forEach((sec, i) => {
        const startA = (i * (Math.PI * 2) / SECTIONS.length) - Math.PI / 2 - 0.02;
        const endA = ((i + 1) * (Math.PI * 2) / SECTIONS.length) - Math.PI / 2 + 0.02;
        const midA = startA + (endA - startA) / 2;

        let waitTime = (crowdDataCache?.zones?.sections) ? crowdDataCache.zones.sections['Section ' + sec] || 5 : 5;
        const info = getStatusInfo(waitTime);
        
        ctx.beginPath();
        ctx.ellipse(cx, cy, secOuterRX, secOuterRY, 0, startA, endA, false);
        ctx.ellipse(cx, cy, secInnerRX, secInnerRY, 0, endA, startA, true);
        ctx.closePath();
        
        if (mode === 'heatmap') {
            const txInner = cx + Math.cos(midA) * secInnerRX;
            const tyInner = cy + Math.sin(midA) * secInnerRY;
            const txOuter = cx + Math.cos(midA) * secOuterRX;
            const tyOuter = cy + Math.sin(midA) * secOuterRY;
            
            const grd = ctx.createLinearGradient(txInner, tyInner, txOuter, tyOuter);
            grd.addColorStop(0, info.color);
            grd.addColorStop(1, info.color.replace('0.5', '0.2'));
            
            ctx.fillStyle = grd;
            ctx.fill();
            
            if (waitTime > 14) {
                const pulse = 0.1 + 0.15 * Math.sin(timestamp / 200);
                ctx.fillStyle = `rgba(255, 42, 85, ${pulse})`;
                ctx.fill();
            }
        } else {
            const isTarget = localStorage.getItem('targetSection') === sec;
            const targetColor = `rgba(0, 229, 255, ${isTarget ? 0.6 : 0.05})`;
            ctx.fillStyle = targetColor;
            ctx.fill();
            if(isTarget) {
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }

        if (hoverState === 'Section ' + sec) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        const tx = cx + Math.cos(midA) * (secInnerRX + (secOuterRX - secInnerRX) / 2);
        const ty = cy + Math.sin(midA) * (secInnerRY + (secOuterRY - secInnerRY) / 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; 
        ctx.font = `bold ${12 * scaleFactor}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(sec, tx, ty);
        
        canvasZones.push({ id: 'Section ' + sec, x: tx, y: ty, r: 35 * scaleFactor, wait: waitTime, label: info.label });
    });

    // 3. Service Icons - MOVED INSIDE WITH COLOR CODING
    STATIC_ICONS.forEach(item => {
        const radiusX = walkRX;
        const radiusY = walkRY;
        const ix = cx + Math.cos(item.angle) * radiusX;
        const iy = cy + Math.sin(item.angle) * radiusY;
        const isHovered = hoverState === item.label;

        let waitTime = 5;
        if (item.type === 'food') waitTime = crowdDataCache?.zones?.foodCourts?.[item.label] || 5;
        if (item.type === 'restroom') waitTime = crowdDataCache?.zones?.restrooms?.[item.label] || 5;
        if (item.type === 'merch') waitTime = crowdDataCache?.zones?.merchandise?.[item.label] || 5;
        
        const info = getStatusInfo(waitTime);

        ctx.save();
        ctx.beginPath();
        const baseR = 15 * scaleFactor;
        const activeR = isHovered ? baseR * 1.2 : baseR;
        ctx.arc(ix, iy, activeR, 0, Math.PI * 2);
        
        // COLOR CODED BACKGROUND
        ctx.fillStyle = info.color.replace('0.5', '0.9'); 
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.shadowColor = info.neon;
        ctx.fill();
        
        ctx.strokeStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.font = `${12 * scaleFactor}px Inter`;
        ctx.fillText(item.icon, ix, iy + 4);

        canvasZones.push({ id: item.label, x: ix, y: iy, r: 18 * scaleFactor, wait: waitTime, label: info.label });
    });

    // 4. Entry Gates
    GATES.forEach(gate => {
        const radiusX = secOuterRX + 80 * scaleFactor;
        const radiusY = secOuterRY + 80 * scaleFactor;
        const gx = cx + Math.cos(gate.angle) * radiusX;
        const gy = cy + Math.sin(gate.angle) * radiusY;
        const isHovered = hoverState === gate.name;
        
        let waitTime = crowdDataCache?.zones?.gates?.[gate.name] || 5;
        let info = getStatusInfo(waitTime);
        
        ctx.beginPath();
        ctx.arc(gx, gy, 28 * scaleFactor, 0, Math.PI * 2);
        ctx.strokeStyle = info.neon + '33';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.save();
        ctx.beginPath();
        const gR = (isHovered ? 24 : 20) * scaleFactor;
        ctx.arc(gx, gy, gR, 0, Math.PI * 2);
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.shadowColor = info.neon;
        ctx.fillStyle = info.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${10 * scaleFactor}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('G' + gate.name.replace('Gate ', ''), gx, gy + 3);
        
        canvasZones.push({ id: gate.name, x: gx, y: gy, r: 28 * scaleFactor, wait: waitTime, label: info.label });
    });

    // 5. PATHFINDER ROUTE (Find My Seat Mode)
    // 5. DYNAMIC PATHFINDER ROUTE (Dijkstra Integrated)
    if (mode === 'find-seat' && window.currentOptimalPath) {
        ctx.save();
        ctx.setLineDash([10, 5]);
        ctx.lineDashOffset = -timestamp / 50;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        window.currentOptimalPath.forEach((nodeId, idx) => {
            let nodeX, nodeY;

            // Find Gate Position
            const gate = GATES.find(g => g.name === nodeId);
            if (gate) {
                const radiusX = secOuterRX + 80 * scaleFactor;
                const radiusY = secOuterRY + 80 * scaleFactor;
                nodeX = cx + Math.cos(gate.angle) * radiusX;
                nodeY = cy + Math.sin(gate.angle) * radiusY;
            } else {
                // Find Section Position
                const secIndex = SECTIONS.indexOf(nodeId);
                if (secIndex !== -1) {
                    const angle = (secIndex * (Math.PI * 2) / SECTIONS.length) - Math.PI / 2 + (Math.PI / SECTIONS.length);
                    nodeX = cx + Math.cos(angle) * walkRX;
                    nodeY = cy + Math.sin(angle) * walkRY;
                }
            }

            if (nodeX !== undefined && nodeY !== undefined) {
                if (idx === 0) ctx.moveTo(nodeX, nodeY);
                else ctx.lineTo(nodeX, nodeY);
            }
        });
        ctx.stroke();
        ctx.restore();
    } else if (mode === 'find-seat') {
        // Fallback or placeholder...
    }
}

function setupCanvasInteraction(canvas) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        let hit = null;
        for (let z of canvasZones) {
            if (Math.hypot(mx - z.x, my - z.y) < z.r) { hit = z; break; }
        }

        if (hit) {
            if (hoverState !== hit.id) {
                hoverState = hit.id;
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            }
            
            canvas.style.cursor = 'pointer';
            
            tooltip.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-1.5 h-1.5 rounded-full" style="background: ${getStatusInfo(hit.wait).neon}; box-shadow: 0 0 8px ${getStatusInfo(hit.wait).neon}"></div>
                    <div class="font-black text-white uppercase text-[0.6rem] tracking-widest">${hit.id}</div>
                </div>
                <div class="space-y-1">
                    <div class="text-[0.7rem] text-slate-300">Wait Time: <span class="text-white font-bold">${hit.wait} min</span></div>
                    <div class="text-[0.6rem] text-slate-500">${hit.label}</div>
                </div>
            `;

            const wrapper = canvas.parentElement;
            const wrapperRect = wrapper.getBoundingClientRect();
            const padding = 12;

            let left = e.clientX - wrapperRect.left + padding;
            let top = e.clientY - wrapperRect.top - 40;

            if (left + 180 > wrapper.offsetWidth) {
                left = e.clientX - wrapperRect.left - 180 - padding;
            }
            if (left < 0) left = padding;
            if (top < 0) top = padding;
            if (top + 100 > wrapper.offsetHeight) top = wrapper.offsetHeight - 110;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.display = 'block';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0px)';
            }, 10);
            
        } else {
            if (hoverState) {
                hoverState = null;
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(5px)';
                setTimeout(() => { if (!hoverState) tooltip.style.display = 'none'; }, 200);
            }
            canvas.style.cursor = 'default';
        }
    });

    canvas.addEventListener('mouseleave', () => { 
        hoverState = null; 
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(5px)';
        setTimeout(() => tooltip.style.display = 'none', 200);
    });
}

export function updateHeatmapData(newData) {
    crowdDataCache = newData;
}
