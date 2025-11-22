let blochSphere = null;

// Gate definitions
const gates = {
    'hadamard': {
        name: 'Hadamard (H)',
        matrix: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
        description: 'Creates superposition from basis states'
    },
    'pauli-x': {
        name: 'Pauli-X (NOT)',
        matrix: [[0, 1], [1, 0]],
        description: 'Bit flip: |0⟩ ↔ |1⟩'
    },
    'pauli-y': {
        name: 'Pauli-Y',
        matrix: [[0, {re: 0, im: -1}], [{re: 0, im: 1}, 0]],
        description: 'Bit flip with phase: |0⟩ → i|1⟩, |1⟩ → -i|0⟩'
    },
    'pauli-z': {
        name: 'Pauli-Z',
        matrix: [[1, 0], [0, -1]],
        description: 'Phase flip: |1⟩ → -|1⟩'
    },
    'phase': {
        name: 'Phase (S)',
        matrix: [[1, 0], [0, {re: 0, im: 1}]],
        description: 'π/2 phase shift on |1⟩'
    },
    't-gate': {
        name: 'T Gate',
        matrix: [[1, 0], [0, {re: Math.cos(Math.PI/4), im: Math.sin(Math.PI/4)}]],
        description: 'π/4 phase shift on |1⟩'
    }
};

// Initialize controls
function initializeControls() {
    const gateSelect = document.getElementById('gate-select');
    const inputStateAlpha = document.getElementById('input-state-alpha');
    const inputStatePhase = document.getElementById('input-state-phase');
    
    gateSelect.addEventListener('change', updateVisualization);
    inputStateAlpha.addEventListener('input', updateVisualization);
    inputStatePhase.addEventListener('input', updateVisualization);
    
    // Initialize Bloch sphere
    const vizContainer = document.getElementById('visualization');
    blochSphere = new BlochSphere(vizContainer);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const gateSelect = document.getElementById('gate-select');
    const inputStateAlpha = document.getElementById('input-state-alpha');
    const inputStatePhase = document.getElementById('input-state-phase');
    
    switch(preset) {
        case 'hadamard-ground':
            gateSelect.value = 'hadamard';
            inputStateAlpha.value = 1.0;
            inputStatePhase.value = 0;
            break;
        case 'not-ground':
            gateSelect.value = 'pauli-x';
            inputStateAlpha.value = 1.0;
            inputStatePhase.value = 0;
            break;
        case 'hadamard-superposition':
            gateSelect.value = 'hadamard';
            inputStateAlpha.value = 0.707;
            inputStatePhase.value = 0;
            break;
    }
    
    updateVisualization();
}

// Apply gate to state
function applyGate(gate, alpha, beta, phase) {
    const m = gate.matrix;
    
    // Input state: alpha|0⟩ + beta*e^(i*phase)|1⟩
    const c0 = alpha;
    const c1_re = beta * Math.cos(phase);
    const c1_im = beta * Math.sin(phase);
    
    // Apply matrix multiplication
    let out0_re, out0_im, out1_re, out1_im;
    
    // m[0][0] * c0 + m[0][1] * c1
    const m00 = typeof m[0][0] === 'number' ? {re: m[0][0], im: 0} : m[0][0];
    const m01 = typeof m[0][1] === 'number' ? {re: m[0][1], im: 0} : m[0][1];
    const m10 = typeof m[1][0] === 'number' ? {re: m[1][0], im: 0} : m[1][0];
    const m11 = typeof m[1][1] === 'number' ? {re: m[1][1], im: 0} : m[1][1];
    
    out0_re = m00.re * c0 + m01.re * c1_re - m01.im * c1_im;
    out0_im = m00.im * c0 + m01.re * c1_im + m01.im * c1_re;
    
    out1_re = m10.re * c0 + m11.re * c1_re - m11.im * c1_im;
    out1_im = m10.im * c0 + m11.re * c1_im + m11.im * c1_re;
    
    // Convert back to alpha, beta, phase form
    const outAlpha = Math.sqrt(out0_re * out0_re + out0_im * out0_im);
    const outBeta = Math.sqrt(out1_re * out1_re + out1_im * out1_im);
    const outPhase = Math.atan2(out1_im, out1_re) - Math.atan2(out0_im, out0_re);
    
    return {alpha: outAlpha, beta: outBeta, phase: outPhase, c0_re: out0_re, c0_im: out0_im, c1_re: out1_re, c1_im: out1_im};
}

// Update visualization based on inputs
function updateVisualization() {
    const gateSelect = document.getElementById('gate-select').value;
    const inputAlpha = parseFloat(document.getElementById('input-state-alpha').value);
    const inputPhase = parseFloat(document.getElementById('input-state-phase').value);
    const inputBeta = Math.sqrt(1 - inputAlpha * inputAlpha);
    
    // Update value displays
    document.getElementById('input-state-alpha-value').textContent = inputAlpha.toFixed(3);
    document.getElementById('input-state-phase-value').textContent = inputPhase.toFixed(2);
    
    const gateData = gates[gateSelect];
    
    // Apply gate
    const output = applyGate(gateData, inputAlpha, inputBeta, inputPhase);
    
    // Calculate probabilities
    const inProb0 = inputAlpha * inputAlpha;
    const inProb1 = inputBeta * inputBeta;
    const outProb0 = output.alpha * output.alpha;
    const outProb1 = output.beta * output.beta;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Selected Gate: ${gateData.name}</h4>
            <p>${gateData.description}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Input State</h4>
            <p><strong>|ψ_in⟩ = ${inputAlpha.toFixed(3)}|0⟩ + ${inputBeta.toFixed(3)}e^(i${inputPhase.toFixed(2)})|1⟩</strong></p>
            <p>P(|0⟩) = ${(inProb0 * 100).toFixed(1)}%, P(|1⟩) = ${(inProb1 * 100).toFixed(1)}%</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Gate Action</h4>
            <p><strong>|ψ_out⟩ = Û|ψ_in⟩</strong></p>
            <p>Unitary transformation preserves norm: ||ψ_out|| = ||ψ_in|| = 1</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Output State</h4>
            <p><strong>|ψ_out⟩ = ${output.alpha.toFixed(3)}|0⟩ + ${output.beta.toFixed(3)}e^(i${output.phase.toFixed(2)})|1⟩</strong></p>
            <p>P(|0⟩) = ${(outProb0 * 100).toFixed(1)}%, P(|1⟩) = ${(outProb1 * 100).toFixed(1)}%</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${Math.abs(inProb0 - outProb0) < 0.01 && Math.abs(inProb1 - outProb1) < 0.01 ? 
                    '→ Probabilities unchanged (phase-only gate)' :
                    '✓ Probabilities changed (gate rotates state on Bloch sphere)'}
            </p>
        </div>
    `;
    
    // Update Bloch sphere visualization
    if (blochSphere) {
        blochSphere.updateState(output.alpha, output.beta, output.phase);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
