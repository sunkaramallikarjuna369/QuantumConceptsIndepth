let blochSphere = null;

// Initialize controls
function initializeControls() {
    const dimension = document.getElementById('dimension');
    const stateAlpha = document.getElementById('state-alpha');
    const statePhase = document.getElementById('state-phase');
    
    dimension.addEventListener('change', updateVisualization);
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

// Update visualization based on inputs
function updateVisualization() {
    const dimension = parseInt(document.getElementById('dimension').value);
    const alpha = parseFloat(document.getElementById('state-alpha').value);
    const phase = parseFloat(document.getElementById('state-phase').value);
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Update value displays
    document.getElementById('state-alpha-value').textContent = alpha.toFixed(3);
    document.getElementById('state-phase-value').textContent = phase.toFixed(2);
    
    // Calculate number of qubits
    const numQubits = Math.log2(dimension);
    
    // Calculate probabilities
    const prob0 = alpha * alpha;
    const prob1 = beta * beta;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Hilbert Space Properties</h4>
            <p><strong>Dimension:</strong> ${dimension}D (${numQubits} qubit${numQubits > 1 ? 's' : ''})</p>
            <p><strong>Complex dimension:</strong> ℂ^${dimension} (${dimension * 2} real dimensions)</p>
            <p><strong>Basis size:</strong> ${dimension} orthonormal basis vectors</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Current State (Single Qubit Subspace)</h4>
            <p><strong>|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}e^(i${phase.toFixed(2)})|1⟩</strong></p>
            <p>Normalized: ⟨ψ|ψ⟩ = ${(prob0 + prob1).toFixed(3)} ${Math.abs(prob0 + prob1 - 1.0) < 0.01 ? '✓' : '✗'}</p>
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
            <h4>Exponential Growth</h4>
            <p><strong>1 qubit:</strong> 2D Hilbert space (4 real dimensions)</p>
            <p><strong>2 qubits:</strong> 4D Hilbert space (8 real dimensions)</p>
            <p><strong>3 qubits:</strong> 8D Hilbert space (16 real dimensions)</p>
            <p><strong>n qubits:</strong> 2^n complex dimensions (2^(n+1) real dimensions)</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${dimension === 2 ? '✓ Single qubit - visualized on Bloch sphere' :
                  dimension === 4 ? '→ Two qubits - 4D space (cannot fully visualize)' :
                  '→ Three qubits - 8D space (exponential complexity)'}
            </p>
        </div>
    `;
    
    // Update Bloch sphere visualization
    if (blochSphere) {
        blochSphere.updateState(alpha, beta, phase);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
