// Operator definitions with eigenstates and eigenvalues
const operators = {
    'pauli-z': {
        name: 'σ_z',
        matrix: [[1, 0], [0, -1]],
        eigenvalues: [1, -1],
        eigenstates: [
            { name: '|0⟩', alpha: 1, beta: 0, phase: 0 },
            { name: '|1⟩', alpha: 0, beta: 1, phase: 0 }
        ]
    },
    'pauli-x': {
        name: 'σ_x',
        matrix: [[0, 1], [1, 0]],
        eigenvalues: [1, -1],
        eigenstates: [
            { name: '|+⟩', alpha: 0.707, beta: 0.707, phase: 0 },
            { name: '|-⟩', alpha: 0.707, beta: 0.707, phase: Math.PI }
        ]
    },
    'pauli-y': {
        name: 'σ_y',
        matrix: [[0, -1], [1, 0]],
        eigenvalues: [1, -1],
        eigenstates: [
            { name: '|+i⟩', alpha: 0.707, beta: 0.707, phase: Math.PI/2 },
            { name: '|-i⟩', alpha: 0.707, beta: 0.707, phase: -Math.PI/2 }
        ]
    },
    'hadamard': {
        name: 'H',
        matrix: [[0.707, 0.707], [0.707, -0.707]],
        eigenvalues: [1, -1],
        eigenstates: [
            { name: '|+⟩', alpha: 0.707, beta: 0.707, phase: 0 },
            { name: '|-⟩', alpha: 0.707, beta: 0.707, phase: Math.PI }
        ]
    }
};

let blochSphere = null;

// Initialize controls
function initializeControls() {
    const operatorSelect = document.getElementById('operator-select');
    const stateAlpha = document.getElementById('state-alpha');
    const statePhase = document.getElementById('state-phase');
    
    operatorSelect.addEventListener('change', updateVisualization);
    stateAlpha.addEventListener('input', updateVisualization);
    statePhase.addEventListener('input', updateVisualization);
    
    // Initialize Bloch sphere
    const vizContainer = document.getElementById('visualization');
    blochSphere = new BlochSphere(vizContainer);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const stateAlpha = document.getElementById('state-alpha');
    const statePhase = document.getElementById('state-phase');
    const operatorSelect = document.getElementById('operator-select');
    
    switch(preset) {
        case 'eigenstate-plus':
            operatorSelect.value = 'pauli-x';
            stateAlpha.value = 0.707;
            statePhase.value = 0;
            break;
        case 'eigenstate-minus':
            operatorSelect.value = 'pauli-x';
            stateAlpha.value = 0.707;
            statePhase.value = Math.PI;
            break;
        case 'superposition':
            stateAlpha.value = 0.6;
            statePhase.value = Math.PI/4;
            break;
    }
    
    updateVisualization();
}

// Measure state (project onto eigenstates)
function measureState() {
    const operatorKey = document.getElementById('operator-select').value;
    const operator = operators[operatorKey];
    
    const alpha = parseFloat(document.getElementById('state-alpha').value);
    const phase = parseFloat(document.getElementById('state-phase').value);
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Calculate overlap with eigenstates
    const overlaps = operator.eigenstates.map(eigenstate => {
        const eAlpha = eigenstate.alpha;
        const eBeta = eigenstate.beta;
        const ePhase = eigenstate.phase;
        
        // Inner product ⟨eigenstate|state⟩
        const realPart = eAlpha * alpha + eBeta * beta * Math.cos(phase - ePhase);
        const imagPart = eBeta * beta * Math.sin(phase - ePhase);
        const overlap = Math.sqrt(realPart * realPart + imagPart * imagPart);
        
        return overlap;
    });
    
    // Probabilities
    const probs = overlaps.map(o => o * o);
    
    // Randomly collapse to one eigenstate based on probabilities
    const rand = Math.random();
    let collapsedIndex = rand < probs[0] ? 0 : 1;
    
    const collapsedState = operator.eigenstates[collapsedIndex];
    const measuredValue = operator.eigenvalues[collapsedIndex];
    
    // Update state to collapsed eigenstate
    document.getElementById('state-alpha').value = collapsedState.alpha;
    document.getElementById('state-phase').value = collapsedState.phase;
    
    updateVisualization();
    
    // Show measurement result
    alert(`Measurement Result:\nEigenvalue: ${measuredValue}\nCollapsed to eigenstate: ${collapsedState.name}\n\nProbabilities were:\n${operator.eigenstates[0].name}: ${(probs[0] * 100).toFixed(1)}%\n${operator.eigenstates[1].name}: ${(probs[1] * 100).toFixed(1)}%`);
}

// Update visualization based on inputs
function updateVisualization() {
    const operatorKey = document.getElementById('operator-select').value;
    const alpha = parseFloat(document.getElementById('state-alpha').value);
    const phase = parseFloat(document.getElementById('state-phase').value);
    
    const operator = operators[operatorKey];
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Update value displays
    document.getElementById('state-alpha-value').textContent = alpha.toFixed(3);
    document.getElementById('state-phase-value').textContent = phase.toFixed(2);
    
    // Calculate overlap with eigenstates
    const overlaps = operator.eigenstates.map(eigenstate => {
        const eAlpha = eigenstate.alpha;
        const eBeta = eigenstate.beta;
        const ePhase = eigenstate.phase;
        
        // Inner product magnitude |⟨eigenstate|state⟩|
        const realPart = eAlpha * alpha + eBeta * beta * Math.cos(phase - ePhase);
        const imagPart = eBeta * beta * Math.sin(phase - ePhase);
        const overlap = Math.sqrt(realPart * realPart + imagPart * imagPart);
        
        return overlap;
    });
    
    // Probabilities
    const probs = overlaps.map(o => o * o);
    
    // Check if state is an eigenstate (one probability ≈ 1)
    const isEigenstate = probs[0] > 0.99 || probs[1] > 0.99;
    const eigenstateIndex = probs[0] > 0.99 ? 0 : (probs[1] > 0.99 ? 1 : -1);
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Current State</h4>
            <p><strong>|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}e^(i${phase.toFixed(2)})|1⟩</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Selected Operator: ${operator.name}</h4>
            <p><strong>Eigenvalues:</strong> λ₁ = ${operator.eigenvalues[0]}, λ₂ = ${operator.eigenvalues[1]}</p>
            <p><strong>Eigenstates:</strong> ${operator.eigenstates[0].name}, ${operator.eigenstates[1].name}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Measurement Probabilities</h4>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${operator.eigenstates[0].name} (λ = ${operator.eigenvalues[0]}):</span>
                    <span><strong>${(probs[0] * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${probs[0] * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${operator.eigenstates[1].name} (λ = ${operator.eigenvalues[1]}):</span>
                    <span><strong>${(probs[1] * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f093fb, #f5576c); height: 100%; width: ${probs[1] * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${isEigenstate ? '#4ade80' : '#fbbf24'};">
                ${isEigenstate ? 
                    `✓ This IS an eigenstate: ${operator.eigenstates[eigenstateIndex].name}<br>Measurement outcome is deterministic: λ = ${operator.eigenvalues[eigenstateIndex]}` :
                    '⚠ This is NOT an eigenstate<br>Measurement outcome is probabilistic'}
            </p>
        </div>
    `;
    
    // Update Bloch sphere
    if (blochSphere) {
        blochSphere.updateState(alpha, beta, phase);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
