const { findOptimalRoute } = require('../services/routingService');

const mockCrowd = {
    zones: {
        gates: { "Gate 1": 5, "Gate 2": 5, "Gate 3": 20, "Gate 4": 5 },
        sections: { 
            "Section A": 5, "Section B": 20, "Section C": 20, "Section D": 5,
            "Section E": 5, "Section F": 5, "Section G": 5, "Section H": 5,
            "Section I": 5, "Section J": 5, "Section K": 5, "Section L": 5,
            "Section M": 5, "Section N": 5
        }
    }
};

const runTests = () => {
    console.log("--- Starting Routing Tests ---");
    
    // Test 1: Gate 1 to Section A (Direct)
    const t1 = findOptimalRoute('Gate 1', 'A', mockCrowd);
    console.log("Test 1 (G1->A):", t1.path.join(' -> '), "| Total Weight:", t1.totalWeight);
    
    // Test 2: Gate 1 to Section D (Should avoid Section B/C due to congestion 20)
    const t2 = findOptimalRoute('Gate 1', 'D', mockCrowd);
    console.log("Test 2 (G1->D):", t2.path.join(' -> '), "| Total Weight:", t2.totalWeight);
    
    if (t2.path.includes('B') || t2.path.includes('C')) {
        console.error("FAIL: Route did not avoid congestion!");
    } else {
        console.log("PASS: Route avoided congestion correctly.");
    }
};

runTests();
