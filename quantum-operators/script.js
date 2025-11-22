// Operator matrices
const operators = {
    'pauli-x': [[0, 1], [1, 0]],
    'pauli-y': [[0, -1], [1, 0]], // Simplified (imaginary parts handled separately)
    'pauli-z': [[1, 0], [0, -1]],
    'hadamard': [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
    'identity': [[1, 0], [0, 1]],
    'phase': [[1, 0], [0, 1]] // Simplified S gate
};

// Initialize controls
function initializeControls() {
    const operatorSelect = document.getElementById('operator-select');
    const stateAlpha = document.getElementById('state-alpha');
    const statePhase = document.getElementById('state-phase');
    
    operatorSelect.addEventListener('change', updateVisualization);
    stateAlpha.addEventListener('input', updateVisualization);
    statePhase.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const stateAlpha = document.getElementById('state-alpha');
    const statePhase = document.getElementById('state-phase');
    
    switch(preset) {
        case 'superposition':
            stateAlpha.value = 0.707;
            statePhase.value = 0;
            break;
        case 'ground':
            stateAlpha.value = 1.0;
            statePhase.value = 0;
            break;
        case 'excited':
            stateAlpha.value = 0.0;
            statePhase.value = 0;
            break;
    }
    
    updateVisualization();
}

// Apply operator to current state
function applyOperator() {
    const operatorName = document.getElementById('operator-select').value;
    const alpha = parseFloat(document.getElementById('state-alpha').value);
    const phase = parseFloat(document.getElementById('state-phase').value);
    
    const beta = Math.sqrt(1 - alpha * alpha);
    const operator = operators[operatorName];
    
    // Apply operator: |ψ'⟩ = Â|ψ⟩
    const newAlpha = operator[0][0] * alpha + operator[0][1] * beta * Math.cos(phase);
    const newBeta = operator[1][0] * alpha + operator[1][1] * beta * Math.cos(phase);
    
    // Normalize
    const norm = Math.sqrt(newAlpha * newAlpha + newBeta * newBeta);
    const normalizedAlpha = Math.abs(newAlpha / norm);
    
    // Update state
    document.getElementById('state-alpha').value = normalizedAlpha;
    document.getElementById('state-phase').value = 0;
    
    updateVisualization();
    
    // Show notification
    const results = document.getElementById('results');
    const notification = document.createElement('div');
    notification.style.cssText = 'background: rgba(74, 222, 128, 0.2); padding: 10px; border-radius: 5px; margin-top: 10px; color: #4ade80;';
    notification.textContent = `Operator ${operatorName} applied!`;
    results.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Update visualization based on inputs
function updateVisualization() {
    const operatorName = document.getElementById('operator-select').value;
    const alpha = parseFloat(document.getElementById('state-alpha').value);
    const phase = parseFloat(document.getElementById('state-phase').value);
    
    // Update value displays
    document.getElementById('state-alpha-value').textContent = alpha.toFixed(3);
    document.getElementById('state-phase-value').textContent = phase.toFixed(2);
    
    const beta = Math.sqrt(1 - alpha * alpha);
    const operator = operators[operatorName];
    
    // Get operator properties
    const operatorInfo = getOperatorInfo(operatorName);
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Current State</h4>
            <p><strong>|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}e<sup>i${phase.toFixed(2)}</sup>|1⟩</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Selected Operator: ${operatorInfo.name}</h4>
            <p>${operatorInfo.description}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Operator Properties</h4>
            <p><strong>Type:</strong> ${operatorInfo.type}</p>
            <p><strong>Hermitian:</strong> ${operatorInfo.hermitian ? 'Yes ✓' : 'No'}</p>
            <p><strong>Unitary:</strong> ${operatorInfo.unitary ? 'Yes ✓' : 'No'}</p>
        </div>
        <div>
            <p style="color: #888; font-size: 0.9em;">
                Click "Apply Operator" to transform the current state.
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(operatorName, operator);
}

// Get operator information
function getOperatorInfo(operatorName) {
    const info = {
        'pauli-x': {
            name: 'Pauli X (σ_x)',
            description: 'Bit-flip operator. Flips |0⟩ ↔ |1⟩. Analogous to classical NOT gate.',
            type: 'Hermitian & Unitary',
            hermitian: true,
            unitary: true
        },
        'pauli-y': {
            name: 'Pauli Y (σ_y)',
            description: 'Combined bit-flip and phase-flip. Rotates around Y-axis of Bloch sphere.',
            type: 'Hermitian & Unitary',
            hermitian: true,
            unitary: true
        },
        'pauli-z': {
            name: 'Pauli Z (σ_z)',
            description: 'Phase-flip operator. Leaves |0⟩ unchanged, flips sign of |1⟩.',
            type: 'Hermitian & Unitary',
            hermitian: true,
            unitary: true
        },
        'hadamard': {
            name: 'Hadamard (H)',
            description: 'Creates superposition. Maps |0⟩ → |+⟩ and |1⟩ → |−⟩.',
            type: 'Hermitian & Unitary',
            hermitian: true,
            unitary: true
        },
        'identity': {
            name: 'Identity (I)',
            description: 'Does nothing. Leaves all states unchanged.',
            type: 'Hermitian & Unitary',
            hermitian: true,
            unitary: true
        },
        'phase': {
            name: 'Phase (S)',
            description: 'Adds π/2 phase to |1⟩ component. Also called √Z gate.',
            type: 'Unitary',
            hermitian: false,
            unitary: true
        }
    };
    return info[operatorName];
}

// Update visual display
function updateVisualDisplay(operatorName, operator) {
    const viz = document.getElementById('visualization');
    
    // Display operator matrix
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Operator Matrix</h4>
            
            <div style="display: flex; justify-content: center; margin: 30px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 100px); gap: 2px; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                        ${operator[0][0].toFixed(3)}
                    </div>
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                        ${operator[0][1].toFixed(3)}
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                        ${operator[1][0].toFixed(3)}
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                        ${operator[1][1].toFixed(3)}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <p style="margin: 0; font-size: 0.9em; color: #888;">
                    This 2×2 matrix acts on the state vector [α, β]<sup>T</sup>
                </p>
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
