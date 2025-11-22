// Initialize controls
function initializeControls() {
    const alphaReal = document.getElementById('alpha-real');
    const alphaImag = document.getElementById('alpha-imag');
    const betaReal = document.getElementById('beta-real');
    const betaImag = document.getElementById('beta-imag');
    
    alphaReal.addEventListener('input', updateVisualization);
    alphaImag.addEventListener('input', updateVisualization);
    betaReal.addEventListener('input', updateVisualization);
    betaImag.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const alphaReal = document.getElementById('alpha-real');
    const alphaImag = document.getElementById('alpha-imag');
    const betaReal = document.getElementById('beta-real');
    const betaImag = document.getElementById('beta-imag');
    
    switch(preset) {
        case 'normalized':
            alphaReal.value = 0.707;
            alphaImag.value = 0;
            betaReal.value = 0.707;
            betaImag.value = 0;
            break;
        case 'complex':
            alphaReal.value = 0.6;
            alphaImag.value = 0.4;
            betaReal.value = 0.5;
            betaImag.value = 0.5;
            break;
        case 'real':
            alphaReal.value = 0.8;
            alphaImag.value = 0;
            betaReal.value = 0.6;
            betaImag.value = 0;
            break;
    }
    
    updateVisualization();
}

// Normalize the state
function normalizeState() {
    const alphaReal = parseFloat(document.getElementById('alpha-real').value);
    const alphaImag = parseFloat(document.getElementById('alpha-imag').value);
    const betaReal = parseFloat(document.getElementById('beta-real').value);
    const betaImag = parseFloat(document.getElementById('beta-imag').value);
    
    // Calculate magnitudes
    const alphaMag = Math.sqrt(alphaReal * alphaReal + alphaImag * alphaImag);
    const betaMag = Math.sqrt(betaReal * betaReal + betaImag * betaImag);
    const norm = Math.sqrt(alphaMag * alphaMag + betaMag * betaMag);
    
    if (norm > 0) {
        document.getElementById('alpha-real').value = alphaReal / norm;
        document.getElementById('alpha-imag').value = alphaImag / norm;
        document.getElementById('beta-real').value = betaReal / norm;
        document.getElementById('beta-imag').value = betaImag / norm;
        updateVisualization();
    }
}

// Update visualization based on inputs
function updateVisualization() {
    const alphaReal = parseFloat(document.getElementById('alpha-real').value);
    const alphaImag = parseFloat(document.getElementById('alpha-imag').value);
    const betaReal = parseFloat(document.getElementById('beta-real').value);
    const betaImag = parseFloat(document.getElementById('beta-imag').value);
    
    // Update value displays
    document.getElementById('alpha-real-value').textContent = alphaReal.toFixed(3);
    document.getElementById('alpha-imag-value').textContent = alphaImag.toFixed(3);
    document.getElementById('beta-real-value').textContent = betaReal.toFixed(3);
    document.getElementById('beta-imag-value').textContent = betaImag.toFixed(3);
    
    // Calculate magnitudes (probabilities)
    const alphaMag = Math.sqrt(alphaReal * alphaReal + alphaImag * alphaImag);
    const betaMag = Math.sqrt(betaReal * betaReal + betaImag * betaImag);
    const prob0 = alphaMag * alphaMag;
    const prob1 = betaMag * betaMag;
    const totalProb = prob0 + prob1;
    
    // Check if normalized
    const isNormalized = Math.abs(totalProb - 1.0) < 0.01;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Complex Amplitudes</h4>
            <p><strong>α = ${alphaReal.toFixed(3)} + ${alphaImag.toFixed(3)}i</strong></p>
            <p><strong>β = ${betaReal.toFixed(3)} + ${betaImag.toFixed(3)}i</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Amplitude Magnitudes</h4>
            <p><strong>|α| = ${alphaMag.toFixed(3)}</strong></p>
            <p><strong>|β| = ${betaMag.toFixed(3)}</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Born Rule Probabilities</h4>
            <p><strong>P(0) = |α|² = ${prob0.toFixed(3)}</strong></p>
            <p><strong>P(1) = |β|² = ${prob1.toFixed(3)}</strong></p>
            <p><strong>Total = ${totalProb.toFixed(3)}</strong> ${isNormalized ? '✓ Normalized' : '⚠ Not normalized'}</p>
        </div>
        ${!isNormalized ? '<p style="color: #f5576c;">Click "Normalize" to make |α|² + |β|² = 1</p>' : ''}
    `;
    
    // Update visualization
    updateVisualDisplay(prob0, prob1, isNormalized);
}

// Update visual display
function updateVisualDisplay(prob0, prob1, isNormalized) {
    const viz = document.getElementById('visualization');
    
    const normalizedProb0 = prob0 / (prob0 + prob1);
    const normalizedProb1 = prob1 / (prob0 + prob1);
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Probability Distribution</h4>
            <div style="margin: 20px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="width: 80px; font-weight: bold;">|0⟩:</span>
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
                        <div style="width: ${normalizedProb0*100}%; height: 40px; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${(prob0*100).toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="width: 80px; font-weight: bold;">|1⟩:</span>
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
                        <div style="width: ${normalizedProb1*100}%; height: 40px; background: linear-gradient(90deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${(prob1*100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <p style="margin: 0; color: ${isNormalized ? '#4ade80' : '#f5576c'};">
                    ${isNormalized ? '✓ State is properly normalized' : '⚠ State needs normalization'}
                </p>
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
