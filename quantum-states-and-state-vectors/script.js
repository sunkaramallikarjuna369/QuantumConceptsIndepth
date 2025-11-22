// Quantum States and State Vectors - Interactive Implementation

// State variables
let state = {
    stateType: 'ket',
    basis: 'computational',
    alphaMag: 0.707,
    betaMag: 0.707,
    phase: 0
};

// Bloch sphere instance
let blochSphere;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    blochSphere = new BlochSphere('bloch-sphere');
    updateVisualization();
});

// Initialize input controls
function initializeControls() {
    document.getElementById('state-type').addEventListener('change', (e) => {
        state.stateType = e.target.value;
        updateVisualization();
    });

    document.getElementById('basis').addEventListener('change', (e) => {
        state.basis = e.target.value;
        updateVisualization();
    });

    document.getElementById('alpha-mag').addEventListener('input', (e) => {
        state.alphaMag = parseFloat(e.target.value);
        document.getElementById('alpha-value').textContent = state.alphaMag.toFixed(3);
        updateVisualization();
    });

    document.getElementById('beta-mag').addEventListener('input', (e) => {
        state.betaMag = parseFloat(e.target.value);
        document.getElementById('beta-value').textContent = state.betaMag.toFixed(3);
        updateVisualization();
    });

    document.getElementById('phase').addEventListener('input', (e) => {
        state.phase = parseFloat(e.target.value);
        document.getElementById('phase-value').textContent = state.phase.toFixed(2);
        updateVisualization();
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPreset(btn.dataset.preset);
        });
    });
}

// Apply preset states
function applyPreset(preset) {
    switch(preset) {
        case 'zero':
            state.alphaMag = 1;
            state.betaMag = 0;
            state.phase = 0;
            break;
        case 'one':
            state.alphaMag = 0;
            state.betaMag = 1;
            state.phase = 0;
            break;
        case 'plus':
            state.alphaMag = 0.707;
            state.betaMag = 0.707;
            state.phase = 0;
            break;
        case 'minus':
            state.alphaMag = 0.707;
            state.betaMag = 0.707;
            state.phase = Math.PI;
            break;
    }
    
    document.getElementById('alpha-mag').value = state.alphaMag;
    document.getElementById('alpha-value').textContent = state.alphaMag.toFixed(3);
    document.getElementById('beta-mag').value = state.betaMag;
    document.getElementById('beta-value').textContent = state.betaMag.toFixed(3);
    document.getElementById('phase').value = state.phase;
    document.getElementById('phase-value').textContent = state.phase.toFixed(2);
    
    updateVisualization();
}

// Process and update visualization
function updateVisualization() {
    // Normalize amplitudes
    const norm = Math.sqrt(state.alphaMag * state.alphaMag + state.betaMag * state.betaMag);
    const alpha = norm > 0 ? state.alphaMag / norm : 1;
    const beta = norm > 0 ? state.betaMag / norm : 0;
    
    // Get basis labels
    const basisLabels = getBasisLabels();
    
    // Update ket display
    const ketDisplay = `|ψ⟩ = ${formatCoeff(alpha, 0)}${basisLabels[0]} + ${formatCoeff(beta, state.phase)}${basisLabels[1]}`;
    document.getElementById('ket-display').textContent = ketDisplay;
    
    // Update bra display
    const braDisplay = `⟨ψ| = ${formatCoeff(alpha, 0, true)}${basisLabels[0].replace('|', '⟨').replace('⟩', '|')} + ${formatCoeff(beta, state.phase, true)}${basisLabels[1].replace('|', '⟨').replace('⟩', '|')}`;
    document.getElementById('bra-display').textContent = braDisplay;
    
    // Update vector display
    const vectorDisplay = `[${formatCoeff(alpha, 0)}]<br>[${formatCoeff(beta, state.phase)}]`;
    document.getElementById('vector-display').innerHTML = vectorDisplay;
    
    // Update inner product
    const innerProduct = alpha * alpha + beta * beta;
    document.getElementById('inner-product').textContent = `⟨ψ|ψ⟩ = ${innerProduct.toFixed(3)}`;
    
    // Update Bloch sphere
    const theta = 2 * Math.acos(Math.min(1, alpha));
    const phi = state.phase;
    if (blochSphere) {
        blochSphere.updateState(theta, phi);
    }
}

// Get basis labels based on selected basis
function getBasisLabels() {
    switch(state.basis) {
        case 'computational':
            return ['|0⟩', '|1⟩'];
        case 'hadamard':
            return ['|+⟩', '|−⟩'];
        case 'circular':
            return ['|R⟩', '|L⟩'];
        default:
            return ['|0⟩', '|1⟩'];
    }
}

// Format coefficient with phase
function formatCoeff(magnitude, phase, conjugate = false) {
    if (conjugate) {
        phase = -phase;
    }
    
    if (Math.abs(phase) < 0.01) {
        return magnitude.toFixed(3);
    }
    
    const real = magnitude * Math.cos(phase);
    const imag = magnitude * Math.sin(phase);
    
    if (Math.abs(imag) < 0.01) {
        return real.toFixed(3);
    }
    
    const imagStr = imag >= 0 ? `+${imag.toFixed(3)}i` : `${imag.toFixed(3)}i`;
    return `(${real.toFixed(3)}${imagStr})`;
}
