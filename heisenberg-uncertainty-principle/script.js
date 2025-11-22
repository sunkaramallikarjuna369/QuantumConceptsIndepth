// Initialize controls
function initializeControls() {
    const positionWidth = document.getElementById('position-width');
    const hbar = document.getElementById('hbar');
    const observablePair = document.getElementById('observable-pair');
    
    positionWidth.addEventListener('input', updateVisualization);
    hbar.addEventListener('input', updateVisualization);
    observablePair.addEventListener('change', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const positionWidth = document.getElementById('position-width');
    
    switch(preset) {
        case 'narrow':
            positionWidth.value = 0.5;
            break;
        case 'wide':
            positionWidth.value = 5.0;
            break;
        case 'minimum':
            positionWidth.value = 1.0;
            break;
    }
    
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const deltaX = parseFloat(document.getElementById('position-width').value);
    const hbar = parseFloat(document.getElementById('hbar').value);
    const observablePair = document.getElementById('observable-pair').value;
    
    // Update value displays
    document.getElementById('position-width-value').textContent = deltaX.toFixed(2);
    document.getElementById('hbar-value').textContent = hbar.toFixed(3);
    
    // Calculate minimum momentum uncertainty (in units where we use nm and appropriate momentum units)
    const minDeltaP = (hbar / 2) / deltaX;
    const uncertaintyProduct = deltaX * minDeltaP;
    const minUncertaintyProduct = hbar / 2;
    const isMinimum = Math.abs(uncertaintyProduct - minUncertaintyProduct) < 0.01;
    
    // Get observable names
    let obs1Name, obs2Name, obs1Symbol, obs2Symbol, relation;
    switch(observablePair) {
        case 'position-momentum':
            obs1Name = 'Position';
            obs2Name = 'Momentum';
            obs1Symbol = 'x';
            obs2Symbol = 'p';
            relation = 'ΔxΔp ≥ ℏ/2';
            break;
        case 'energy-time':
            obs1Name = 'Energy';
            obs2Name = 'Time';
            obs1Symbol = 'E';
            obs2Symbol = 't';
            relation = 'ΔEΔt ≥ ℏ/2';
            break;
        case 'angular':
            obs1Name = 'Angular Position';
            obs2Name = 'Angular Momentum';
            obs1Symbol = 'θ';
            obs2Symbol = 'L';
            relation = 'ΔθΔL ≥ ℏ/2';
            break;
    }
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Uncertainty Relation</h4>
            <p style="font-size: 1.1em;"><strong>${relation}</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Current Values</h4>
            <p><strong>Δ${obs1Symbol} = ${deltaX.toFixed(3)} nm</strong></p>
            <p><strong>Δ${obs2Symbol} ≥ ${minDeltaP.toFixed(3)} (ℏ/nm)</strong></p>
            <p><strong>Δ${obs1Symbol}Δ${obs2Symbol} = ${uncertaintyProduct.toFixed(3)}</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Minimum Uncertainty</h4>
            <p><strong>ℏ/2 = ${minUncertaintyProduct.toFixed(3)}</strong></p>
            <p style="color: ${isMinimum ? '#4ade80' : '#f5576c'};">
                ${isMinimum ? '✓ This is a minimum uncertainty state!' : 'This state has excess uncertainty'}
            </p>
        </div>
        <div>
            <p style="color: #888; font-size: 0.9em;">
                As Δ${obs1Symbol} decreases (more precise ${obs1Name.toLowerCase()}), Δ${obs2Symbol} must increase (less precise ${obs2Name.toLowerCase()}).
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(deltaX, minDeltaP, minUncertaintyProduct, obs1Symbol, obs2Symbol);
}

// Update visual display
function updateVisualDisplay(deltaX, deltaP, minProduct, obs1Symbol, obs2Symbol) {
    const viz = document.getElementById('visualization');
    
    // Normalize for display (scale to 0-100%)
    const maxWidth = 10; // max deltaX value
    const xWidth = (deltaX / maxWidth) * 100;
    const pWidth = ((deltaP / (minProduct / 0.1)) * 100); // scale deltaP inversely
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Uncertainty Trade-off</h4>
            
            <div style="margin: 30px 0;">
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="width: 100px; font-weight: bold;">Δ${obs1Symbol}:</span>
                        <span style="flex: 1; color: #888;">(smaller = more precise)</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; height: 40px;">
                        <div style="width: ${xWidth}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${deltaX.toFixed(2)}
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0; font-size: 1.5em; color: #f5576c;">
                    ⇅
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="width: 100px; font-weight: bold;">Δ${obs2Symbol}:</span>
                        <span style="flex: 1; color: #888;">(larger = less precise)</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; height: 40px;">
                        <div style="width: ${Math.min(pWidth, 100)}%; height: 100%; background: linear-gradient(90deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ≥${deltaP.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <p style="margin: 0; font-size: 0.9em; color: #888;">
                    The product Δ${obs1Symbol}Δ${obs2Symbol} cannot be smaller than ℏ/2
                </p>
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
