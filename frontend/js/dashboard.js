import { getStatusInfo, formatCamelCase } from './utils.js';

const apiZonesList = ['gates', 'restrooms', 'foodCourts', 'merchandise'];
let charts = {};
let lastRecievedData = null;
let aiInterval = null;

export function initDashboard(data) {
    if (!data) return;
    lastRecievedData = data;
    
    renderStats(data);
    renderOperationalStatus(data);
    initStaticChart(data);
    startAIRecommendationsLoop();
}

function renderStats(data) {
    const updateStat = (id, value, area) => {
        const valEl = document.getElementById(id + 'Value');
        const areaEl = document.getElementById(id + 'Area');
        if (valEl) valEl.textContent = value;
        if (areaEl) areaEl.textContent = area;
    };

    if (data.highestCongestion) {
        updateStat('mostCrowded', `${data.highestCongestion.wait}m`, data.highestCongestion.area);
    }
    if (data.clearestPath) {
        updateStat('leastCrowded', `${data.clearestPath.wait}m`, data.clearestPath.area);
    }
    if (data.bestRestroom) {
        updateStat('bestRestroom', `${data.bestRestroom.wait}m`, data.bestRestroom.area);
    }
}

function renderOperationalStatus(data) {
    const container = document.getElementById('operationalGrid');
    if (!container) return;

    container.innerHTML = apiZonesList.map(zoneKey => {
        const zoneData = data.zones[zoneKey];
        const categoryLabel = formatCamelCase(zoneKey);
        
        return `
            <div class="glass-panel p-6 rounded-3xl transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-white font-black text-[0.65rem] uppercase tracking-widest opacity-60">${categoryLabel}</h3>
                    <i class="fa-solid fa-circle-nodes text-accent/30"></i>
                </div>
                <div class="space-y-6">
                    ${Object.entries(zoneData).map(([name, wait]) => {
                        const info = getStatusInfo(wait);
                        const percentage = Math.min((wait / 20) * 100, 100);
                        return `
                            <div class="group">
                                <div class="flex justify-between text-xs mb-2">
                                    <span class="text-slate-400 group-hover:text-slate-200 transition-colors">${name}</span>
                                    <span style="color: ${info.neon}" class="font-bold">${wait}m</span>
                                </div>
                                <div class="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                    <div class="h-full transition-all duration-1000 rounded-full" style="width: ${percentage}%; background-color: ${info.neon}; shadow: 0 0 5px ${info.neon}"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function startAIRecommendationsLoop() {
    if (aiInterval) clearInterval(aiInterval);
    
    const update = () => {
        if (!lastRecievedData) return;
        
        const list = document.getElementById('aiRecommendationsList');
        const suggestionText = document.getElementById('aiSuggestionText');
        if (!list) return;

        // 1. Pick three dynamic recommendations
        const foodKeys = Object.keys(lastRecievedData.zones.foodCourts);
        const restroomKeys = Object.keys(lastRecievedData.zones.restrooms);
        const merchKeys = Object.keys(lastRecievedData.zones.merchandise);

        const bestFood = foodKeys.sort((a, b) => lastRecievedData.zones.foodCourts[a] - lastRecievedData.zones.foodCourts[b])[0];
        const bestRestroom = restroomKeys.sort((a, b) => lastRecievedData.zones.restrooms[a] - lastRecievedData.zones.restrooms[b])[0];
        const bestMerch = merchKeys.sort((a, b) => lastRecievedData.zones.merchandise[a] - lastRecievedData.zones.merchandise[b])[0];

        const recs = [
            { label: 'Food Recommendation', area: bestFood, wait: lastRecievedData.zones.foodCourts[bestFood], icon: '🍔' },
            { label: 'Restroom Availability', area: bestRestroom, wait: lastRecievedData.zones.restrooms[bestRestroom], icon: '🚻' },
            { label: 'Shopping Pulse', area: bestMerch, wait: lastRecievedData.zones.merchandise[bestMerch], icon: '🛍️' }
        ];

        list.innerHTML = recs.map(rec => {
            const info = getStatusInfo(rec.wait);
            return `
                 <div class="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all animate-in fade-in duration-500">
                    <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl">
                        ${rec.icon}
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-end mb-1">
                            <div>
                                <div class="text-[0.6rem] text-slate-500 font-bold uppercase tracking-widest">${rec.label}</div>
                                <div class="text-sm font-bold text-white">${rec.area}</div>
                            </div>
                            <span class="text-[0.6rem] font-black px-2 py-0.5 rounded-md" style="color: ${info.neon}; background: ${info.neon}22">${info.label.toUpperCase()}</span>
                        </div>
                        <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
                             <div class="h-full transition-all duration-1000" style="width: ${100 - (rec.wait*4)}%; background: ${info.neon}"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (suggestionText) {
            const options = [
                `Go to ${bestFood} for the fastest service in the stadium right now.`,
                `Use the ${bestRestroom} facility; it currently has the lowest predicted wait time.`,
                `Visit ${bestMerch} for official merchandise with minimal queueing.`
            ];
            suggestionText.textContent = options[Math.floor(Math.random() * options.length)];
        }
    };

    update();
    aiInterval = setInterval(update, 5000); // Update every 5 seconds
}

function initStaticChart(data) {
    const ctx = document.getElementById('trafficChart');
    if (!ctx || charts.traffic) return;

    const sections = data.zones.sections;
    const labels = Object.keys(sections).map(s => s.replace('Section ', ''));
    const values = Object.values(sections);

    const titleEl = document.getElementById('chartTitle');
    if (titleEl) titleEl.innerHTML = `<div class="w-1 h-5 bg-accent rounded-full"></div> Section Density Overview`;

    charts.traffic = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: values.map(v => getStatusInfo(v).neon + '88'),
                borderColor: values.map(v => getStatusInfo(v).neon),
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b92b0' }, beginAtZero: true },
                x: { grid: { display: false }, ticks: { color: '#8b92b0', font: { weight: 'bold' } } }
            }
        }
    });
}

export function updateDashboard(data) {
    if (!data) return;
    lastRecievedData = data;
    
    renderStats(data);
    renderOperationalStatus(data);
    
    if (charts.traffic) {
        const sections = data.zones.sections;
        charts.traffic.data.datasets[0].data = Object.values(sections);
        charts.traffic.data.datasets[0].backgroundColor = Object.values(sections).map(v => getStatusInfo(v).neon + '88');
        charts.traffic.data.datasets[0].borderColor = Object.values(sections).map(v => getStatusInfo(v).neon);
        charts.traffic.update();
    }
}
