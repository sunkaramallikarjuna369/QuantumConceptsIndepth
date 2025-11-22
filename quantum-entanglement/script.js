// Quantum Entanglement - Interactive Implementation

// State variables
let state = {
    bellState: 'phi-plus',
    basisA: 'z',
    basisB: 'z',
    showCorrelations: true
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    updateVisualization();
});

// Initialize input controls
function initializeControls() {
    document.getElementById('bell-state').addEventListener('change', (e) => {
        state.bellState = e.target.value;
        updateVisualization();
    });

    document.getElementById('measurement-basis-a').addEventListener('change', (e) => {
        state.basisA = e.target.value;
        updateVisualization();
    });

    document.getElementById('measurement-basis-b').addEventListener('change', (e) => {
        state.basisB = e.target.value;
        updateVisualization();
    });

    document.getElementById('show-correlations').addEventListener('change', (e) => {
        state.showCorrelations = e.target.checked;
        updateVisualization();
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.bellState = btn.dataset.preset;
            document.getElementById('bell-state').value = state.bellState;
            updateVisualization();
        });
    });
}

// Update visualization
function updateVisualization() {
    // Update Bell state display
    const bellStateText = getBellStateText(state.bellState);
    document.getElementById('bell-state-display').textContent = bellStateText;
    
    // Calculate probabilities
    const probs = calculateProbabilities(state.bellState, state.basisA, state.basisB);
    
    // Update probability bars
    updateProbabilityBar('prob-00', 'prob-00-value', probs.p00);
    updateProbabilityBar('prob-01', 'prob-01-value', probs.p01);
    updateProbabilityBar('prob-10', 'prob-10-value', probs.p10);
    updateProbabilityBar('prob-11', 'prob-11-value', probs.p11);
    
    // Update entanglement measure (all Bell states have concurrence = 1)
    document.getElementById('entanglement-measure').textContent = 'Concurrence: 1.000';
    
    // Update correlation
    const correlation = calculateCorrelation(probs);
    updateCorrelation(correlation);
}

// Get Bell state text
function getBellStateText(bellState) {
    const states = {
        'phi-plus': '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
        'phi-minus': '|Φ⁻⟩ = (|00⟩ − |11⟩)/√2',
        'psi-plus': '|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2',
        'psi-minus': '|Ψ⁻⟩ = (|01⟩ − |10⟩)/√2'
    };
    return states[bellState] || states['phi-plus'];
}

// Calculate measurement probabilities
function calculateProbabilities(bellState, basisA, basisB) {
    // Simplified calculation for Z-basis measurements
    // In a full implementation, this would handle all basis combinations
    
    let p00 = 0, p01 = 0, p10 = 0, p11 = 0;
    
    if (basisA === 'z' && basisB === 'z') {
        switch(bellState) {
            case 'phi-plus':
                p00 = 0.5;
                p11 = 0.5;
                break;
            case 'phi-minus':
                p00 = 0.5;
                p11 = 0.5;
                break;
            case 'psi-plus':
                p01 = 0.5;
                p10 = 0.5;
                break;
            case 'psi-minus':
                p01 = 0.5;
                p10 = 0.5;
                break;
        }
    } else if (basisA === 'x' && basisB === 'x') {
        // X-basis measurements
        switch(bellState) {
            case 'phi-plus':
                p00 = 0.5;
                p11 = 0.5;
                break;
            case 'phi-minus':
                p01 = 0.5;
                p10 = 0.5;
                break;
            case 'psi-plus':
                p00 = 0.5;
                p11 = 0.5;
                break;
            case 'psi-minus':
                p01 = 0.5;
                p10 = 0.5;
                break;
        }
    } else {
        // Mixed bases - outcomes are uncorrelated
        p00 = 0.25;
        p01 = 0.25;
        p10 = 0.25;
        p11 = 0.25;
    }
    
    return { p00, p01, p10, p11 };
}

// Update probability bar
function updateProbabilityBar(barId, valueId, probability) {
    const bar = document.getElementById(barId);
    const value = document.getElementById(valueId);
    
    if (bar) {
        bar.style.width = `${probability * 100}%`;
    }
    if (value) {
        value.textContent = `${(probability * 100).toFixed(1)}%`;
    }
}

// Calculate correlation coefficient
function calculateCorrelation(probs) {
    // Correlation = P(00) + P(11) - P(01) - P(10)
    return probs.p00 + probs.p11 - probs.p01 - probs.p10;
}

// Update correlation display
function updateCorrelation(correlation) {
    const indicator = document.getElementById('correlation-indicator');
    const valueDisplay = document.getElementById('correlation-value');
    
    // Position indicator (-1 to +1 maps to 0% to 100%)
    const position = ((correlation + 1) / 2) * 100;
    if (indicator) {
        indicator.style.left = `${position}%`;
    }
    
    if (valueDisplay) {
        const sign = correlation >= 0 ? '+' : '';
        valueDisplay.textContent = `Correlation: ${sign}${correlation.toFixed(3)}`;
    }
}
