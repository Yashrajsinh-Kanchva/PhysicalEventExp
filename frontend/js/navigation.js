import { fetchOptimalRoute } from './api.js';

export function initNavigation() {
    const form = document.getElementById('seatForm');
    if (!form) return;

    renderDistanceState({
        title: 'Loading...',
        message: 'Choose your gate and seating section to calculate the best route.'
    });

    // Load saved
    const uGate = localStorage.getItem('targetGate');
    const uSec = localStorage.getItem('targetSection');
    if (uGate) document.getElementById('gateSelect').value = uGate;
    if (uSec) document.getElementById('sectionSelect').value = uSec;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const g = document.getElementById('gateSelect').value;
        const s = document.getElementById('sectionSelect').value;
        localStorage.setItem('targetGate', g);
        localStorage.setItem('targetSection', s);

        renderDistanceState({
            eyebrow: 'Guidance Status',
            title: 'Loading...',
            message: 'Optimizing the least-congested route to your section.'
        });
        await solveOptimalRoute(g, s);
        window.dispatchEvent(new Event('navigationUpdate'));
    });

    if (uGate && uSec) {
        renderDistanceState({
            eyebrow: 'Guidance Status',
            title: 'Loading...',
            message: 'Restoring your last saved route.'
        });
        solveOptimalRoute(uGate, uSec);
    }
}

async function solveOptimalRoute(g, s) {
    try {
        const sectionId = s; // s is just 'A', 'B', etc.
        const result = await fetchOptimalRoute(g, sectionId);

        if (result && result.path?.length) {
            updateDistanceUI(result);
            // Store path for heatmap drawing
            window.currentOptimalPath = result.path;
            return;
        }
    } catch (error) {
        console.error('Unable to load optimal route:', error);
    }

    window.currentOptimalPath = null;
    renderDistanceState({
        eyebrow: 'Guidance Status',
        title: 'Route unavailable',
        message: 'We could not load route guidance right now. Please try again in a moment.',
        toneClass: 'text-amber-400'
    });
}

function updateDistanceUI(result) {
    const display = document.getElementById('distanceDisplay');
    if (!display) return;

    const hasWeight = Number.isFinite(result.totalWeight);
    const distMeters = hasWeight ? Math.max(1, Math.floor(result.totalWeight * 5)) : null;

    display.innerHTML = `
        <div class="mb-4">
            <div class="text-slate-400 text-[0.6rem] uppercase font-black tracking-widest mb-2">Optimized Path</div>
            <div class="flex flex-wrap gap-1.5">
                ${result.path.map(node => `<span class="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[0.6rem] font-bold text-cyan-400">${node}</span>`).join('<i class="fa-solid fa-chevron-right text-[0.5rem] opacity-30 self-center"></i>')}
            </div>
        </div>
        <div class="space-y-2">
            <div class="text-slate-400 text-[0.6rem] uppercase font-black tracking-widest">Estimated Journey</div>
            <div class="text-3xl font-black text-white">${distMeters === null ? 'Loading...' : `~${distMeters}m`}</div>
            <div class="text-[0.6rem] text-emerald-400 font-bold uppercase tracking-tighter">
               <i class="fa-solid fa-bolt"></i> Congestion-Aware Optimal
            </div>
        </div>
    `;
}

function renderDistanceState({
    eyebrow = 'Guidance Status',
    title,
    message,
    toneClass = 'text-white'
}) {
    const display = document.getElementById('distanceDisplay');
    if (!display) return;

    display.innerHTML = `
        <div class="space-y-4">
            <div>
                <div class="text-slate-400 text-[0.6rem] uppercase font-black tracking-widest mb-2">${eyebrow}</div>
                <div class="text-lg font-black tracking-tight ${toneClass}">${title}</div>
            </div>
            <p class="text-[0.75rem] text-slate-400 leading-relaxed">${message}</p>
        </div>
    `;
}
