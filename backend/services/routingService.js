/**
 * Dijkstra's Algorithm Implementation for StadiumFlow
 */

class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = new Map();
    }

    addNode(node) {
        this.nodes.add(node);
        this.edges.set(node, []);
    }

    addEdge(u, v, baseWeight) {
        this.edges.get(u).push({ node: v, weight: baseWeight });
        this.edges.get(v).push({ node: u, weight: baseWeight });
    }

    dijkstra(startNode, endNode, crowdData) {
        let distances = {};
        let prev = {};
        let pq = new PriorityQueue();

        distances[startNode] = 0;
        this.nodes.forEach(node => {
            if (node !== startNode) distances[node] = Infinity;
            pq.enqueue(node, distances[node]);
        });

        while (!pq.isEmpty()) {
            let u = pq.dequeue();

            if (u === endNode) break;

            this.edges.get(u).forEach(edge => {
                const neighbor = edge.node;
                // dynamicWeight = distance + (congestion * factor)
                const congestion = this.getNodeCongestion(neighbor, crowdData);
                const weight = edge.weight + (congestion * 5); // Factor of 5 for wait minutes
                
                let alt = distances[u] + weight;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = u;
                    pq.updatePriority(neighbor, alt);
                }
            });
        }

        return this.reconstructPath(prev, endNode, distances[endNode]);
    }

    getNodeCongestion(node, crowdData) {
        if (!crowdData || !crowdData.zones) return 0;
        
        // Map node name to crowdData keys
        if (node.startsWith('Gate')) return crowdData.zones.gates[node] || 0;
        if (node.length === 1) return crowdData.zones.sections[`Section ${node}`] || 0;
        return 0;
    }

    reconstructPath(prev, endNode, totalWeight) {
        let path = [];
        let curr = endNode;
        while (curr) {
            path.unshift(curr);
            curr = prev[curr];
        }
        return { path, totalWeight };
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue() {
        return this.values.shift().val;
    }
    isEmpty() {
        return this.values.length === 0;
    }
    updatePriority(val, newPriority) {
        const item = this.values.find(v => v.val === val);
        if (item) item.priority = newPriority;
        this.sort();
    }
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

const stadiumGraph = new Graph();
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
SECTIONS.forEach(s => stadiumGraph.addNode(s));
['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4'].forEach(g => stadiumGraph.addNode(g));

// Circle connections (Weights represent distance units)
for (let i = 0; i < SECTIONS.length; i++) {
    stadiumGraph.addEdge(SECTIONS[i], SECTIONS[(i + 1) % SECTIONS.length], 20);
}

// Gate connections
stadiumGraph.addEdge('Gate 1', 'A', 10); stadiumGraph.addEdge('Gate 1', 'N', 10);
stadiumGraph.addEdge('Gate 2', 'D', 10); stadiumGraph.addEdge('Gate 2', 'E', 10);
stadiumGraph.addEdge('Gate 3', 'H', 10); stadiumGraph.addEdge('Gate 3', 'I', 10);
stadiumGraph.addEdge('Gate 4', 'K', 10); stadiumGraph.addEdge('Gate 4', 'L', 10);

const findOptimalRoute = (start, end, crowdData) => {
    return stadiumGraph.dijkstra(start, end, crowdData);
};

module.exports = { findOptimalRoute };
