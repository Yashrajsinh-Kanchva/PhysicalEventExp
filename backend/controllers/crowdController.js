const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/checks.json');

if (!fs.existsSync(dataPath)) {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify([]));
}

const generateSimulatedData = () => {
    const randomTime = () => Math.floor(Math.random() * 20) + 1;
    
    const zones = {
        gates: { "Gate 1": randomTime(), "Gate 2": randomTime(), "Gate 3": randomTime(), "Gate 4": randomTime() },
        restrooms: { "Men 1": randomTime(), "Men 2": randomTime(), "Women 1": randomTime(), "Women 2": randomTime() },
        foodCourts: { "Food Court A": randomTime(), "Food Court B": randomTime(), "Food Court C": randomTime() },
        merchandise: { "Store 1": randomTime(), "Store 2": randomTime() },
        sections: { 
            "Section A": randomTime(), "Section B": randomTime(), "Section C": randomTime(),
            "Section D": randomTime(), "Section E": randomTime(), "Section F": randomTime(),
            "Section G": randomTime(), "Section H": randomTime(), "Section I": randomTime(),
            "Section J": randomTime(), "Section K": randomTime(), "Section L": randomTime(),
            "Section M": randomTime(), "Section N": randomTime()
        }
    };

    let maxC = { area: '', wait: -1 };
    let minP = { area: '', wait: 99 };
    let bestR = { area: '', wait: 99 };

    // Calculate highest congestion
    for(const key in zones.gates) {
        if(zones.gates[key] > maxC.wait) maxC = { area: key, wait: zones.gates[key] };
        if(zones.gates[key] < minP.wait) minP = { area: key, wait: zones.gates[key] };
    }
    // Calculate best restroom
    for(const key in zones.restrooms) {
        if(zones.restrooms[key] < bestR.wait) bestR = { area: key, wait: zones.restrooms[key] };
    }

    return {
        timestamp: new Date().toISOString(),
        highestCongestion: maxC,
        clearestPath: minP,
        bestRestroom: bestR,
        zones: zones
    };
};

exports.getCrowdData = (req, res) => {
    const data = generateSimulatedData();
    res.json(data);
};

exports.saveCheck = (req, res) => {
    try {
        const newData = req.body;
        let history = [];
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            history = fileContent ? JSON.parse(fileContent) : [];
        }
        history.unshift(newData);
        if (history.length > 10) history = history.slice(0, 10);
        fs.writeFileSync(dataPath, JSON.stringify(history, null, 2));
        res.status(200).json({ success: true, message: 'Saved' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed' });
    }
};

exports.getHistory = (req, res) => {
    try {
        if (!fs.existsSync(dataPath)) return res.json([]);
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        res.json(fileContent ? JSON.parse(fileContent) : []);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed' });
    }
};
