export const API_BASE = '/api';

export async function fetchCrowdData() {
    try {
        const res = await fetch(`${API_BASE}/crowd-data`);
        if(!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        // Background save for persistent telemetry
        fetch(`${API_BASE}/save-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(e => console.warn("Save failed"));

        return data;
    } catch (error) {
        console.error("Error fetching crowd data:", error);
        return null; 
    }
}
