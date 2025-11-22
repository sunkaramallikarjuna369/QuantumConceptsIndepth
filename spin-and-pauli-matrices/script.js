// Pauli matrices
const pauliMatrices = {
    x: [[0, 1], [1, 0]],
    y: [[0, -1], [1, 0]], // Represented as [real, imag] pairs: [[0,-i],[i,0]]
    z: [[1, 0], [0, -1]]
};

// Initialize controls
function initializeControls() {
    const spinAxis = document.getElementById('spin-axis');
    const theta = document.getElementById('theta');
    const phi = document.getElementById('phi');
    
    spinAxis.addEventListener('change', updateVisualization);
    theta.addEventListener('input', updateVisualization);
    phi.addEventListener('input', updateVisualization);
    
    // Initialize Bloch sphere if available
    if (typeof BlochSphere !== 'undefined') {
        window.blochSphere = new BlochSphere('visualization');
    }
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const spinAxis = document.getElementById('spin-axis');
    const theta = document.getElementById('theta');
    const phi = document.getElementById('phi');
    
    switch(preset) {
        case 'spin-up-z':
            spinAxis.value = 'z';
            theta.value = 0;
            phi.value = 0;
            break;
        case 'spin-down-z':
            spinAxis.value = 'z';
            theta.value = 180;
            phi.value = 0;
            break;
        case 'spin-right':
            spinAxis.value = 'x';
            theta.value = 90;
            phi.value = 0;
            break;
    }
    
    updateVisualization();
}

// Calculate spin state
function calculateSpinState(thetaDeg, phiDeg) {
    const theta = thetaDeg * Math.PI / 180;
    const phi = phiDeg * Math.PI / 180;
    
    // Bloch sphere parameterization: |ψ⟩ = cos(θ/2)|↑⟩ + e^(iφ)sin(θ/2)|↓⟩
    const alpha = Math.cos(theta / 2);
    const beta_real = Math.cos(phi) * Math.sin(theta / 2);
    const beta_imag = Math.sin(phi) * Math.sin(theta / 2);
    
    return {
        alpha: {real: alpha, imag: 0},
        beta: {real: beta_real, imag: beta_imag}
    };
}

// Calculate expectation value of spin operator
function calculateExpectation(state, axis) {
    const {alpha, beta} = state;
    
    // For Pauli matrices, calculate ⟨ψ|σ|ψ⟩
    let expectation = 0;
    
    switch(axis) {
        case 'x':
            // σx = [[0,1],[1,0]]
            // ⟨σx⟩ = 2Re(α*β)
            expectation = 2 * (alpha.real * beta.real + alpha.imag * beta.imag);
            break;
        case 'y':
            // σy = [[0,-i],[i,0]]
            // ⟨σy⟩ = 2Im(α*β)
            expectation = 2 * (alpha.real * beta.imag - alpha.imag * beta.real);
            break;
        case 'z':
            // σz = [[1,0],[0,-1]]
            // ⟨σz⟩ = |α|² - |β|²
            const alpha_norm = alpha.real * alpha.real + alpha.imag * alpha.imag;
            const beta_norm = beta.real * beta.real + beta.imag * beta.imag;
            expectation = alpha_norm - beta_norm;
            break;
    }
    
    return expectation;
}

// Update visualization based on inputs
function updateVisualization() {
    const spinAxis = document.getElementById('spin-axis').value;
    const thetaDeg = parseFloat(document.getElementById('theta').value);
    const phiDeg = parseFloat(document.getElementById('phi').value);
    
    // Update value displays
    document.getElementById('theta-value').textContent = thetaDeg.toFixed(0);
    document.getElementById('phi-value').textContent = phiDeg.toFixed(0);
    
    // Calculate spin state
    const state = calculateSpinState(thetaDeg, phiDeg);
    
    // Calculate expectation values
    const exp_x = calculateExpectation(state, 'x');
    const exp_y = calculateExpectation(state, 'y');
    const exp_z = calculateExpectation(state, 'z');
    
    // Calculate probabilities for measurement along selected axis
    let prob_up, prob_down;
    const theta = thetaDeg * Math.PI / 180;
    const phi = phiDeg * Math.PI / 180;
    
    switch(spinAxis) {
        case 'x':
            // Probability for |→⟩ and |←⟩
            prob_up = Math.pow(Math.cos(theta/2) / Math.sqrt(2) + Math.cos(phi) * Math.sin(theta/2) / Math.sqrt(2), 2) +
                      Math.pow(Math.sin(phi) * Math.sin(theta/2) / Math.sqrt(2), 2);
            prob_down = 1 - prob_up;
            break;
        case 'y':
            // Probability for |⊙⟩ and |⊗⟩
            prob_up = Math.pow(Math.cos(theta/2) / Math.sqrt(2), 2) +
                      Math.pow((Math.cos(phi) * Math.sin(theta/2) - 1) / Math.sqrt(2), 2) +
                      Math.pow(Math.sin(phi) * Math.sin(theta/2) / Math.sqrt(2), 2);
            prob_down = 1 - prob_up;
            break;
        case 'z':
        default:
            // Probability for |↑⟩ and |↓⟩
            prob_up = Math.pow(Math.cos(theta/2), 2);
            prob_down = Math.pow(Math.sin(theta/2), 2);
            break;
    }
    
    // Axis names
    const axisNames = {
        'x': 'X-axis (Sx)',
        'y': 'Y-axis (Sy)',
        'z': 'Z-axis (Sz)',
        'custom': 'Custom Direction'
    };
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Spin State on Bloch Sphere</h4>
            <p><strong>θ = ${thetaDeg}°, φ = ${phiDeg}°</strong></p>
            <p>|ψ⟩ = ${state.alpha.real.toFixed(3)}|↑⟩ + (${state.beta.real.toFixed(3)} + ${state.beta.imag.toFixed(3)}i)|↓⟩</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Expectation Values ⟨Ŝi⟩ = (ℏ/2)⟨σi⟩</h4>
            <p><strong>⟨σx⟩ = ${exp_x.toFixed(3)}</strong></p>
            <p><strong>⟨σy⟩ = ${exp_y.toFixed(3)}</strong></p>
            <p><strong>⟨σz⟩ = ${exp_z.toFixed(3)}</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Measurement Along ${axisNames[spinAxis]}</h4>
            <p><strong>P(+ℏ/2) = ${(prob_up * 100).toFixed(1)}%</strong></p>
            <p><strong>P(-ℏ/2) = ${(prob_down * 100).toFixed(1)}%</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Pauli Matrix for ${axisNames[spinAxis]}</h4>
            <p style="font-family: monospace;">
                ${spinAxis === 'x' ? 'σx = [[0, 1], [1, 0]]' :
                  spinAxis === 'y' ? 'σy = [[0, -i], [i, 0]]' :
                  'σz = [[1, 0], [0, -1]]'}
            </p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${thetaDeg === 0 ? '✓ Pure |↑⟩ state (north pole)' :
                  thetaDeg === 180 ? '✓ Pure |↓⟩ state (south pole)' :
                  thetaDeg === 90 && phiDeg === 0 ? '→ |→⟩ state (equator, +x)' :
                  '→ Superposition state on Bloch sphere'}
            </p>
        </div>
    `;
    
    // Update Bloch sphere visualization
    if (window.blochSphere) {
        const alpha = state.alpha.real;
        const beta_mag = Math.sqrt(state.beta.real * state.beta.real + state.beta.imag * state.beta.imag);
        const beta_phase = Math.atan2(state.beta.imag, state.beta.real);
        window.blochSphere.updateState(alpha, beta_mag, beta_phase);
    } else {
        updateVisualDisplay(thetaDeg, phiDeg, exp_x, exp_y, exp_z);
    }
}

// Update visual display (fallback if Bloch sphere not available)
function updateVisualDisplay(theta, phi, exp_x, exp_y, exp_z) {
    const viz = document.getElementById('visualization');
    
    // Create simple 2D projection
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;
    
    // Convert to Cartesian coordinates
    const thetaRad = theta * Math.PI / 180;
    const phiRad = phi * Math.PI / 180;
    const x = radius * Math.sin(thetaRad) * Math.cos(phiRad);
    const y = radius * Math.sin(thetaRad) * Math.sin(phiRad);
    const z = radius * Math.cos(thetaRad);
    
    // Project onto 2D (simple orthographic projection)
    const projX = centerX + x;
    const projY = centerY - z;
    
    viz.innerHTML = `
        <svg width="${width}" height="${height}" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
            <!-- Bloch sphere circle -->
            <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            
            <!-- Axes -->
            <line x1="${centerX}" y1="${centerY - radius - 20}" x2="${centerX}" y2="${centerY + radius + 20}" 
                  stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="5,5"/>
            <line x1="${centerX - radius - 20}" y1="${centerY}" x2="${centerX + radius + 20}" y2="${centerY}" 
                  stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="5,5"/>
            
            <!-- Spin vector -->
            <line x1="${centerX}" y1="${centerY}" x2="${projX}" y2="${projY}" 
                  stroke="#667eea" stroke-width="3"/>
            <circle cx="${projX}" cy="${projY}" r="8" fill="#667eea"/>
            
            <!-- Labels -->
            <text x="${centerX}" y="${centerY - radius - 25}" fill="white" text-anchor="middle" font-size="14">|↑⟩</text>
            <text x="${centerX}" y="${centerY + radius + 35}" fill="white" text-anchor="middle" font-size="14">|↓⟩</text>
            <text x="${centerX + radius + 25}" y="${centerY + 5}" fill="white" text-anchor="start" font-size="14">|→⟩</text>
            
            <!-- Title -->
            <text x="${width/2}" y="25" fill="white" text-anchor="middle" font-size="16" font-weight="bold">Bloch Sphere (2D Projection)</text>
        </svg>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
