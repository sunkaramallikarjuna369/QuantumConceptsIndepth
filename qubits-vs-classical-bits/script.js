let blochSphere = null;

// Initialize controls
function initializeControls() {
    const bitType = document.getElementById('bit-type');
    const qubitAlpha = document.getElementById('qubit-alpha');
    const qubitPhase = document.getElementById('qubit-phase');
    const classicalState = document.getElementById('classical-state');
    
    bitType.addEventListener('change', () => {
        toggleControls();
        updateVisualization();
    });
    qubitAlpha.addEventListener('input', updateVisualization);
    qubitPhase.addEventListener('input', updateVisualization);
    classicalState.addEventListener('change', updateVisualization);
    
    // Initialize Bloch sphere
    const vizContainer = document.getElementById('visualization');
    blochSphere = new BlochSphere(vizContainer);
    
    toggleControls();
    updateVisualization();
}

// Toggle between classical and quantum controls
function toggleControls() {
    const bitType = document.getElementById('bit-type').value;
    const qubitControls = document.getElementById('qubit-controls');
    const qubitPhaseControl = document.getElementById('qubit-phase-control');
    const classicalControls = document.getElementById('classical-controls');
    
    if (bitType === 'quantum') {
        qubitControls.style.display = 'block';
        qubitPhaseControl.style.display = 'block';
        classicalControls.style.display = 'none';
    } else {
        qubitControls.style.display = 'none';
        qubitPhaseControl.style.display = 'none';
        classicalControls.style.display = 'block';
    }
}

// Apply preset configurations
function applyPreset(preset) {
    const bitType = document.getElementById('bit-type');
    const qubitAlpha = document.getElementById('qubit-alpha');
    const qubitPhase = document.getElementById('qubit-phase');
    const classicalState = document.getElementById('classical-state');
    
    switch(preset) {
        case 'classical-0':
            bitType.value = 'classical';
            classicalState.value = '0';
            break;
        case 'classical-1':
            bitType.value = 'classical';
            classicalState.value = '1';
            break;
        case 'qubit-superposition':
            bitType.value = 'quantum';
            qubitAlpha.value = 0.707;
            qubitPhase.value = 0;
            break;
        case 'qubit-ground':
            bitType.value = 'quantum';
            qubitAlpha.value = 1.0;
            qubitPhase.value = 0;
            break;
    }
    
    toggleControls();
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const bitType = document.getElementById('bit-type').value;
    
    if (bitType === 'classical') {
        updateClassicalVisualization();
    } else {
        updateQuantumVisualization();
    }
}

// Update classical bit visualization
function updateClassicalVisualization() {
    const classicalState = document.getElementById('classical-state').value;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Classical Bit State</h4>
            <p><strong>Value: ${classicalState}</strong></p>
            <p>State: ${classicalState === '0' ? 'Off / False' : 'On / True'}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Properties</h4>
            <p><strong>Definite State:</strong> The bit has a single, well-defined value</p>
            <p><strong>Measurement:</strong> Reading the bit gives ${classicalState} with 100% certainty</p>
            <p><strong>Information:</strong> Stores exactly 1 bit of information</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Comparison with Qubit</h4>
            <p>✗ No superposition - cannot be in both states simultaneously</p>
            <p>✗ No entanglement - cannot create quantum correlations</p>
            <p>✓ Deterministic - measurement outcome is always predictable</p>
            <p>✓ Copyable - can be cloned freely</p>
        </div>
    `;
    
    // Update visualization
    const viz = document.getElementById('visualization');
    viz.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h4 style="margin-bottom: 30px;">Classical Bit: ${classicalState}</h4>
            
            <div style="display: flex; justify-content: center; gap: 40px; margin: 40px 0;">
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: ${classicalState === '0' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)'}; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: bold; margin-bottom: 10px;">
                        0
                    </div>
                    <p style="color: ${classicalState === '0' ? '#4ade80' : '#888'};">
                        ${classicalState === '0' ? '✓ Current State' : 'Not Active'}
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: ${classicalState === '1' ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'rgba(255,255,255,0.1)'}; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: bold; margin-bottom: 10px;">
                        1
                    </div>
                    <p style="color: ${classicalState === '1' ? '#4ade80' : '#888'};">
                        ${classicalState === '1' ? '✓ Current State' : 'Not Active'}
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <p style="margin: 0; color: #fbbf24;">
                    Classical bit is in a definite state: ${classicalState}<br>
                    No superposition or quantum effects
                </p>
            </div>
        </div>
    `;
}

// Update quantum bit visualization
function updateQuantumVisualization() {
    const alpha = parseFloat(document.getElementById('qubit-alpha').value);
    const phase = parseFloat(document.getElementById('qubit-phase').value);
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Update value displays
    document.getElementById('qubit-alpha-value').textContent = alpha.toFixed(3);
    document.getElementById('qubit-phase-value').textContent = phase.toFixed(2);
    
    // Calculate probabilities
    const prob0 = alpha * alpha;
    const prob1 = beta * beta;
    
    // Check if in superposition
    const inSuperposition = prob0 > 0.01 && prob1 > 0.01;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Qubit State</h4>
            <p><strong>|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}e^(i${phase.toFixed(2)})|1⟩</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Measurement Probabilities</h4>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|0⟩):</span>
                    <span><strong>${(prob0 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${prob0 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|1⟩):</span>
                    <span><strong>${(prob1 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f093fb, #f5576c); height: 100%; width: ${prob1 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Quantum Properties</h4>
            <p><strong>Superposition:</strong> ${inSuperposition ? '✓ Yes - qubit is in both states simultaneously' : '✗ No - qubit is in a definite state'}</p>
            <p><strong>Information Content:</strong> Requires 2 complex numbers (infinite classical bits to describe fully)</p>
            <p><strong>Measurement:</strong> Probabilistic - collapses to |0⟩ or |1⟩</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${inSuperposition ? '#4ade80' : '#fbbf24'};">
                ${inSuperposition ? 
                    '✓ Qubit is in superposition<br>Exhibits quantum behavior: can process multiple values simultaneously' :
                    '⚠ Qubit is in a definite state<br>Behaves like a classical bit in this configuration'}
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
