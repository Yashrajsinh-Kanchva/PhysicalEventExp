export function getStatusInfo(waitTime) {
    if (waitTime <= 7) return { color: 'rgba(0, 255, 100, 0.5)', neon: '#00ff80', label: 'Low Crowd' };
    if (waitTime <= 14) return { color: 'rgba(255, 200, 0, 0.5)', neon: '#ffcc00', label: 'Medium Crowd' };
    return { color: 'rgba(255, 0, 0, 0.6)', neon: '#ff2a55', label: 'High Crowd' };
}

export function initClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    
    function update() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.innerHTML = `<span class="clock-icon">⏱</span> ${hrs}:${mins}:${secs}`;
    }
    update();
    setInterval(update, 1000);
}

export function formatCamelCase(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function showToast(msg, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'bg-slate-900/95 border border-cyan-500/30 border-l-4 border-l-cyan-500 rounded-xl p-4 flex items-center gap-4 text-white shadow-2xl transition-all duration-400 opacity-0 translate-y-5 pointer-events-auto';
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-5');
    });
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-5');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}
