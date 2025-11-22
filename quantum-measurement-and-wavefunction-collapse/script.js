let blochSphere;
let measurementHistory = [];

// Initialize controls
function initializeControls() {
    const alpha = document.getElementById('alpha');
    const phase = document.getElementById('phase');
    const basis = document.getElementById('measurement-basis');
    const numMeasurements = document.getElementById('num-measurements');
    
    alpha.addEventListener('input', updateVisualization);
    phase.addEventListener('input', updateVisualization);
    basis.addEventListener('change', updateVisualization);
    numMeasurements.addEventListener('input', updateVisualization);
    
    initializeBlochSphere();
    updateVisualization();
}

// Initialize Bloch sphere visualization
function initializeBlochSphere() {
    const container = document.getElementById('visualization');
    blochSphere = new BlochSphere(container);
}

// Apply preset configurations
function applyPreset(preset) {
    const alpha = document.getElementById('alpha');
    const phase = document.getElementById('phase');
    
    switch(preset) {
        case 'superposition':
            alpha.value = 0.707;
            phase.value = 0;
            break;
        case 'ground':
            alpha.value = 1.0;
            phase.value = 0;
            break;
        case 'excited':
            alpha.value = 0.0;
            phase.value = 0;
            break;
    }
    
    updateVisualization();
}

// Perform measurement simulation
function performMeasurement() {
    const alpha = parseFloat(document.getElementById('alpha').value);
    const phase = parseFloat(document.getElementById('phase').value);
    const basis = document.getElementById('measurement-basis').value;
    const numMeasurements = parseInt(document.getElementById('num-measurements').value);
    
    // Calculate beta from normalization
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Calculate probabilities based on measurement basis
    let prob0, prob1;
    if (basis === 'z') {
        prob0 = alpha * alpha;
        prob1 = beta * beta;
    } else if (basis === 'x') {
        // Transform to X-basis
        const plusAmp = (alpha + beta * Math.cos(phase)) / Math.sqrt(2);
        const minusAmp = (alpha - beta * Math.cos(phase)) / Math.sqrt(2);
        prob0 = plusAmp * plusAmp;
        prob1 = minusAmp * minusAmp;
    } else { // y-basis
        // Transform to Y-basis
        const upAmp = (alpha + beta * Math.sin(phase)) / Math.sqrt(2);
        const downAmp = (alpha - beta * Math.sin(phase)) / Math.sqrt(2);
        prob0 = upAmp * upAmp;
        prob1 = downAmp * downAmp;
    }
    
    // Simulate measurements
    let count0 = 0;
    let count1 = 0;
    measurementHistory = [];
    
    for (let i = 0; i < numMeasurements; i++) {
        const outcome = Math.random() < prob0 ? 0 : 1;
        if (outcome === 0) count0++;
        else count1++;
        measurementHistory.push(outcome);
    }
    
    // Display results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Measurement Statistics (${numMeasurements} measurements)</h4>
            <p><strong>Outcome 0:</strong> ${count0} times (${(count0/numMeasurements*100).toFixed(1)}%)</p>
            <p><strong>Outcome 1:</strong> ${count1} times (${(count1/numMeasurements*100).toFixed(1)}%)</p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Theoretical Probabilities</h4>
            <p><strong>P(0):</strong> ${(prob0*100).toFixed(1)}%</p>
            <p><strong>P(1):</strong> ${(prob1*100).toFixed(1)}%</p>
        </div>
        <div>
            <h4>Probability Bars</h4>
            <div style="margin: 10px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="width: 60px;">|0⟩:</span>
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
                        <div style="width: ${prob0*100}%; height: 30px; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${(prob0*100).toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="width: 60px;">|1⟩:</span>
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
                        <div style="width: ${prob1*100}%; height: 30px; background: linear-gradient(90deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${(prob1*100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update visualization based on inputs
function updateVisualization() {
    const alpha = parseFloat(document.getElementById('alpha').value);
    const phase = parseFloat(document.getElementById('phase').value);
    const numMeasurements = parseInt(document.getElementById('num-measurements').value);
    
    // Update value displays
    document.getElementById('alpha-value').textContent = alpha.toFixed(3);
    document.getElementById('phase-value').textContent = phase.toFixed(2);
    document.getElementById('num-measurements-value').textContent = numMeasurements;
    
    // Calculate beta from normalization
    const beta = Math.sqrt(1 - alpha * alpha);
    
    // Update Bloch sphere
    if (blochSphere) {
        blochSphere.updateState(alpha, beta, phase);
    }
    
    // Update results display
    const results = document.getElementById('results');
    const prob0 = alpha * alpha;
    const prob1 = beta * beta;
    
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Current Quantum State</h4>
            <p><strong>|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}e<sup>i${phase.toFixed(2)}</sup>|1⟩</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Measurement Probabilities (Z-basis)</h4>
            <p><strong>P(0):</strong> ${(prob0*100).toFixed(1)}%</p>
            <p><strong>P(1):</strong> ${(prob1*100).toFixed(1)}%</p>
        </div>
        <div>
            <p style="color: #888; font-size: 0.9em;">Click "Perform Measurement" to simulate ${numMeasurements} measurements and see wavefunction collapse in action.</p>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
