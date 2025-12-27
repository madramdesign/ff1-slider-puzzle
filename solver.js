// Port of the Python solver to JavaScript

class PuzzleSolver {
    constructor(size = 4) {
        this.size = size;
        this.goal = this._generateGoal();
    }

    _generateGoal() {
        const goal = [];
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(i * this.size + j + 1);
            }
            goal.push(row);
        }
        goal[this.size - 1][this.size - 1] = 0; // Blank is 0
        return goal;
    }

    _findBlank(state) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (state[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        throw new Error("No blank found in state");
    }

    _manhattanDistance(state) {
        let distance = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = state[i][j];
                if (value === 0) continue;
                
                // Goal position for this value
                const goalI = Math.floor((value - 1) / this.size);
                const goalJ = (value - 1) % this.size;
                distance += Math.abs(i - goalI) + Math.abs(j - goalJ);
            }
        }
        return distance;
    }

    _linearConflict(state) {
        // Linear conflict: two tiles are in conflict if they're in the same row/column
        // and both are in their goal row/column but reversed
        let conflicts = 0;
        
        // Check rows
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {
                const value = state[i][j];
                if (value !== 0) {
                    const goalI = Math.floor((value - 1) / this.size);
                    if (goalI === i) {
                        row.push(value);
                    }
                }
            }
            // Count inversions in this row (conflicts)
            for (let a = 0; a < row.length; a++) {
                for (let b = a + 1; b < row.length; b++) {
                    if (row[a] > row[b]) {
                        conflicts++;
                    }
                }
            }
        }
        
        // Check columns
        for (let j = 0; j < this.size; j++) {
            const col = [];
            for (let i = 0; i < this.size; i++) {
                const value = state[i][j];
                if (value !== 0) {
                    const goalJ = (value - 1) % this.size;
                    if (goalJ === j) {
                        col.push(value);
                    }
                }
            }
            // Count inversions in this column (conflicts)
            for (let a = 0; a < col.length; a++) {
                for (let b = a + 1; b < col.length; b++) {
                    if (col[a] > col[b]) {
                        conflicts++;
                    }
                }
            }
        }
        
        return conflicts * 2; // Each conflict requires at least 2 moves
    }

    _heuristic(state) {
        // Manhattan distance + linear conflict heuristic
        return this._manhattanDistance(state) + this._linearConflict(state);
    }

    _getNeighbors(state) {
        const neighbors = [];
        const [bi, bj] = this._findBlank(state);
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, down, left, right
        
        for (const [di, dj] of directions) {
            const ni = bi + di;
            const nj = bj + dj;
            if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
                // Create a deep copy of the state
                const newState = state.map(row => [...row]);
                // Swap blank with neighbor
                [newState[bi][bj], newState[ni][nj]] = [newState[ni][nj], newState[bi][bj]];
                neighbors.push(newState);
            }
        }
        return neighbors;
    }

    _stateToString(state) {
        return state.map(row => row.join(',')).join('|');
    }

    solve(initial, progressCallback = null, useIDA = true) {
        // Deep copy initial state
        const initialState = initial.map(row => [...row]);
        const initialStateKey = this._stateToString(initialState);
        const goalKey = this._stateToString(this.goal);
        
        // Check if already solved - compare strings for efficiency
        if (initialStateKey === goalKey) {
            // Already solved, return single-state path
            return [initialState.map(row => [...row])];
        }

        // For complex puzzles, try IDA* first (more memory efficient)
        if (useIDA) {
            const initialHeuristic = this._heuristic(initialState);
            // Use IDA* for puzzles that need more than 40 moves (estimated)
            if (initialHeuristic > 40) {
                const idaResult = this.solveIDA(initial);
                if (idaResult) return idaResult;
                // Fall back to A* if IDA* fails
            }
        }

        // Use a simple binary heap for better performance
        class MinHeap {
            constructor() {
                this.heap = [];
            }
            
            push(item) {
                this.heap.push(item);
                this._bubbleUp(this.heap.length - 1);
            }
            
            pop() {
                if (this.heap.length === 0) return null;
                if (this.heap.length === 1) return this.heap.pop();
                
                const min = this.heap[0];
                const end = this.heap.pop();
                this.heap[0] = end;
                this._sinkDown(0);
                return min;
            }
            
            isEmpty() {
                return this.heap.length === 0;
            }
            
            _bubbleUp(n) {
                const element = this.heap[n];
                while (n > 0) {
                    const parentN = Math.floor((n + 1) / 2) - 1;
                    const parent = this.heap[parentN];
                    if (element[0] >= parent[0]) break;
                    this.heap[parentN] = element;
                    this.heap[n] = parent;
                    n = parentN;
                }
            }
            
            _sinkDown(n) {
                const length = this.heap.length;
                const element = this.heap[n];
                
                while (true) {
                    const leftChildN = 2 * n + 1;
                    const rightChildN = 2 * n + 2;
                    let swap = null;
                    
                    if (leftChildN < length) {
                        const leftChild = this.heap[leftChildN];
                        if (leftChild[0] < element[0]) swap = leftChildN;
                    }
                    
                    if (rightChildN < length) {
                        const rightChild = this.heap[rightChildN];
                        if ((swap === null && rightChild[0] < element[0]) ||
                            (swap !== null && rightChild[0] < this.heap[swap][0])) {
                            swap = rightChildN;
                        }
                    }
                    
                    if (swap === null) break;
                    this.heap[n] = this.heap[swap];
                    this.heap[swap] = element;
                    n = swap;
                }
            }
        }

        const openSet = new MinHeap();
        const initialF = this._heuristic(initialState);
        openSet.push([initialF, 0, initialState]);

        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        
        gScore.set(initialStateKey, 0);

        let iterations = 0;
        const maxIterations = 500000; // Increased for complex puzzles
        const yieldInterval = 100; // Yield to UI every 100 iterations

        while (!openSet.isEmpty() && iterations < maxIterations) {
            iterations++;
            const popped = openSet.pop();
            if (!popped) break; // Heap is empty
            const [currentF, currentG, current] = popped;
            const currentKey = this._stateToString(current);

            if (closedSet.has(currentKey)) continue;
            closedSet.add(currentKey);

            // Check if goal reached
            if (currentKey === goalKey) {
                // Reconstruct path backwards
                const path = [];
                let node = current;
                
                while (node) {
                    path.unshift(node);
                    const nodeKey = this._stateToString(node);
                    if (nodeKey === initialStateKey) break;
                    node = cameFrom.get(nodeKey);
                }
                
                if (this._stateToString(path[0]) !== initialStateKey) {
                    path.unshift(initialState);
                }
                return path;
            }

            const neighbors = this._getNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = this._stateToString(neighbor);
                if (closedSet.has(neighborKey)) continue;

                const tentativeG = currentG + 1;
                const neighborG = gScore.get(neighborKey);
                
                if (neighborG === undefined || tentativeG < neighborG) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeG);
                    const h = this._heuristic(neighbor);
                    const f = tentativeG + h;
                    openSet.push([f, tentativeG, neighbor]);
                }
            }

            // Progress callback every yieldInterval iterations
            if (progressCallback && iterations % yieldInterval === 0) {
                progressCallback(iterations, closedSet.size, openSet.heap.length);
            }
        }

        return null; // Unsolvable or too complex
    }

    // IDA* (Iterative Deepening A*) - More memory efficient for complex puzzles
    solveIDA(initial) {
        const initialState = initial.map(row => [...row]);
        const initialStateKey = this._stateToString(initialState);
        const goalKey = this._stateToString(this.goal);
        
        // Check if already solved
        if (initialStateKey === goalKey) {
            return [initialState.map(row => [...row])];
        }

        const threshold = this._heuristic(initialState);
        let path = [initialState];
        const visited = new Set();
        visited.add(initialStateKey);

        const search = (node, g, threshold) => {
            const nodeKey = this._stateToString(node);
            const f = g + this._heuristic(node);
            
            if (f > threshold) return f;
            if (nodeKey === goalKey) return -1; // Found solution
            
            let min = Infinity;
            const neighbors = this._getNeighbors(node);
            
            for (const neighbor of neighbors) {
                const neighborKey = this._stateToString(neighbor);
                if (visited.has(neighborKey)) continue;
                
                visited.add(neighborKey);
                path.push(neighbor);
                
                const result = search(neighbor, g + 1, threshold);
                
                if (result === -1) return -1; // Found solution
                if (result < min) min = result;
                
                path.pop();
                visited.delete(neighborKey);
            }
            
            return min;
        };

        // Iterative deepening
        let currentThreshold = threshold;
        let iterations = 0;
        const maxIterations = 500000;

        while (iterations < maxIterations) {
            visited.clear();
            visited.add(initialStateKey);
            path = [initialState];
            
            const result = search(initialState, 0, currentThreshold);
            
            if (result === -1) {
                // Found solution
                return path.map(state => state.map(row => [...row]));
            }
            
            if (result === Infinity) {
                return null; // No solution
            }
            
            currentThreshold = result;
            iterations += 1000; // Approximate iteration count
        }

        return null; // Timeout
    }

    getMoves(path) {
        const moves = [];
        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i];
            const nextState = path[i + 1];
            const [bi, bj] = this._findBlank(current);
            // Find what moved into the blank's position
            const movedTile = nextState[bi][bj];
            moves.push(movedTile);
        }
        return moves;
    }

    isSolvable(state) {
        // Check if puzzle is solvable by counting inversions
        const flat = state.flat().filter(x => x !== 0);
        let inversions = 0;
        for (let i = 0; i < flat.length; i++) {
            for (let j = i + 1; j < flat.length; j++) {
                if (flat[i] > flat[j]) inversions++;
            }
        }
        const [blankRow] = this._findBlank(state);
        const blankFromBottom = this.size - blankRow;
        
        // For even-sized puzzles (like 15-puzzle), solvability rule:
        // - If blank is on odd row from bottom, inversions must be even
        // - If blank is on even row from bottom, inversions must be odd
        if (this.size % 2 === 0) {
            return (blankFromBottom % 2) !== (inversions % 2);
        } else {
            return inversions % 2 === 0;
        }
    }
}


