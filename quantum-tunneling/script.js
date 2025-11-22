// Initialize controls
function initializeControls() {
    const barrierHeight = document.getElementById('barrier-height');
    const barrierWidth = document.getElementById('barrier-width');
    const particleEnergy = document.getElementById('particle-energy');
    
    barrierHeight.addEventListener('input', updateVisualization);
    barrierWidth.addEventListener('input', updateVisualization);
    particleEnergy.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const barrierHeight = document.getElementById('barrier-height');
    const barrierWidth = document.getElementById('barrier-width');
    const particleEnergy = document.getElementById('particle-energy');
    
    switch(preset) {
        case 'low-energy':
            barrierHeight.value = 3.0;
            barrierWidth.value = 2.0;
            particleEnergy.value = 1.5;
            break;
        case 'high-tunneling':
            barrierHeight.value = 2.5;
            barrierWidth.value = 1.0;
            particleEnergy.value = 2.0;
            break;
        case 'thin-barrier':
            barrierHeight.value = 3.5;
            barrierWidth.value = 0.5;
            particleEnergy.value = 2.0;
            break;
    }
    
    updateVisualization();
}

// Calculate transmission probability
function calculateTransmission(V0, L, E) {
    // Using natural units where hbar = 1, m = 1
    if (E >= V0) {
        // Above barrier - classical transmission with quantum reflection
        const k1 = Math.sqrt(2 * E);
        const k2 = Math.sqrt(2 * (E - V0));
        const r = (k1 - k2) / (k1 + k2);
        return 1 - r * r; // Some reflection even above barrier
    } else {
        // Below barrier - quantum tunneling
        const kappa = Math.sqrt(2 * (V0 - E));
        const kappaL = kappa * L;
        
        // Exact formula for rectangular barrier
        const sinh_term = Math.sinh(kappaL);
        const denom = 1 + (V0 * V0 * sinh_term * sinh_term) / (4 * E * (V0 - E));
        return 1 / denom;
    }
}

// Calculate wavefunction
function calculateWavefunction(V0, L, E, numPoints = 300) {
    const xMin = -5;
    const xMax = 10;
    const dx = (xMax - xMin) / numPoints;
    
    const wavefunction = [];
    const potential = [];
    
    // Wave vectors
    const k1 = Math.sqrt(2 * E); // Outside barrier
    const kappa = E < V0 ? Math.sqrt(2 * (V0 - E)) : Math.sqrt(2 * (E - V0));
    
    // Transmission and reflection coefficients (simplified)
    const T = calculateTransmission(V0, L, E);
    const R = 1 - T;
    
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * dx;
        let psi_real = 0;
        let psi_imag = 0;
        let V = 0;
        
        // Define barrier region
        const barrier_start = 0;
        const barrier_end = L;
        
        if (x < barrier_start) {
            // Region I: Incident + Reflected wave
            V = 0;
            psi_real = Math.cos(k1 * x) + Math.sqrt(R) * Math.cos(-k1 * x);
            psi_imag = Math.sin(k1 * x) + Math.sqrt(R) * Math.sin(-k1 * x);
        } else if (x >= barrier_start && x <= barrier_end) {
            // Region II: Inside barrier
            V = V0;
            if (E < V0) {
                // Exponential decay
                const decay = Math.exp(-kappa * (x - barrier_start));
                const growth = Math.exp(kappa * (x - barrier_end));
                psi_real = 0.5 * (decay + 0.3 * growth);
                psi_imag = 0;
            } else {
                // Oscillatory inside barrier
                psi_real = Math.sqrt(T) * Math.cos(kappa * (x - barrier_start));
                psi_imag = Math.sqrt(T) * Math.sin(kappa * (x - barrier_start));
            }
        } else {
            // Region III: Transmitted wave
            V = 0;
            psi_real = Math.sqrt(T) * Math.cos(k1 * (x - barrier_end));
            psi_imag = Math.sqrt(T) * Math.sin(k1 * (x - barrier_end));
        }
        
        const prob = psi_real * psi_real + psi_imag * psi_imag;
        wavefunction.push({x, psi_real, psi_imag, prob});
        potential.push({x, V});
    }
    
    return {wavefunction, potential};
}

// Update visualization based on inputs
function updateVisualization() {
    const V0 = parseFloat(document.getElementById('barrier-height').value);
    const L = parseFloat(document.getElementById('barrier-width').value);
    const E = parseFloat(document.getElementById('particle-energy').value);
    
    // Update value displays
    document.getElementById('barrier-height-value').textContent = V0.toFixed(1);
    document.getElementById('barrier-width-value').textContent = L.toFixed(1);
    document.getElementById('particle-energy-value').textContent = E.toFixed(1);
    
    // Calculate transmission probability
    const T = calculateTransmission(V0, L, E);
    const R = 1 - T;
    
    // Calculate decay constant
    const kappa = E < V0 ? Math.sqrt(2 * (V0 - E)) : 0;
    
    // Calculate wavefunction
    const {wavefunction, potential} = calculateWavefunction(V0, L, E);
    
    // Update results
    const results = document.getElementById('results');
    const regime = E < V0 ? 'Tunneling Regime (E < V₀)' : 'Above Barrier (E ≥ V₀)';
    const regimeColor = E < V0 ? '#f5576c' : '#4ade80';
    
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: ${regimeColor};">${regime}</h4>
            <p><strong>Barrier Height V₀ = ${V0.toFixed(2)} eV</strong></p>
            <p><strong>Barrier Width L = ${L.toFixed(2)} nm</strong></p>
            <p><strong>Particle Energy E = ${E.toFixed(2)} eV</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Transmission & Reflection</h4>
            <p><strong>Transmission T = ${(T * 100).toFixed(2)}%</strong></p>
            <p><strong>Reflection R = ${(R * 100).toFixed(2)}%</strong></p>
            ${E < V0 ? `<p>Decay constant κ = ${kappa.toFixed(3)}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Tunneling Formula</h4>
            ${E < V0 ? 
                `<p>T ≈ e^(-2κL) = e^(-${(2 * kappa * L).toFixed(2)}) = ${T.toFixed(6)}</p>
                 <p>κ = √(2m(V₀-E)/ℏ²) = ${kappa.toFixed(3)}</p>` :
                `<p>Classical transmission with quantum reflection</p>
                 <p>T = 1 - R where R = [(k₁-k₂)/(k₁+k₂)]²</p>`
            }
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${regimeColor};">
                ${E < V0 ? 
                    `→ Quantum tunneling: ${(T * 100).toFixed(2)}% probability of transmission despite E < V₀` :
                    `✓ Above barrier: Classical transmission with ${(R * 100).toFixed(2)}% quantum reflection`
                }
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(wavefunction, potential, V0, L, E, T);
}

// Update visual display
function updateVisualDisplay(wavefunction, potential, V0, L, E, T) {
    const viz = document.getElementById('visualization');
    
    // Create SVG visualization
    const width = 600;
    const height = 400;
    const padding = 40;
    
    const xMin = -5;
    const xMax = 10;
    const yMin = -0.5;
    const yMax = Math.max(V0 + 1, 5);
    
    const xScale = (x) => padding + (x - xMin) / (xMax - xMin) * (width - 2 * padding);
    const yScale = (y) => height - padding - (y - yMin) / (yMax - yMin) * (height - 2 * padding);
    
    // Build SVG paths
    const probPath = wavefunction.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.prob * 3)}`
    ).join(' ');
    
    const potentialPath = potential.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.V)}`
    ).join(' ');
    
    // Barrier region
    const barrierX1 = xScale(0);
    const barrierX2 = xScale(L);
    const barrierY1 = yScale(V0);
    const barrierY2 = yScale(0);
    
    viz.innerHTML = `
        <svg width="${width}" height="${height}" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
            <!-- Grid -->
            <line x1="${padding}" y1="${yScale(0)}" x2="${width-padding}" y2="${yScale(0)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            
            <!-- Barrier region (shaded) -->
            <rect x="${barrierX1}" y="${barrierY1}" width="${barrierX2 - barrierX1}" height="${barrierY2 - barrierY1}" 
                  fill="rgba(245, 87, 108, 0.2)" stroke="none"/>
            
            <!-- Potential V(x) -->
            <path d="${potentialPath}" fill="none" stroke="#f5576c" stroke-width="3" opacity="0.8"/>
            
            <!-- Energy level -->
            <line x1="${padding}" y1="${yScale(E)}" x2="${width-padding}" y2="${yScale(E)}" 
                  stroke="#4ade80" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>
            
            <!-- Probability density |ψ|² -->
            <path d="${probPath}" fill="none" stroke="#667eea" stroke-width="3"/>
            
            <!-- Barrier boundaries -->
            <line x1="${barrierX1}" y1="${yScale(0)}" x2="${barrierX1}" y2="${yScale(V0)}" 
                  stroke="#f5576c" stroke-width="2" stroke-dasharray="3,3"/>
            <line x1="${barrierX2}" y1="${yScale(0)}" x2="${barrierX2}" y2="${yScale(V0)}" 
                  stroke="#f5576c" stroke-width="2" stroke-dasharray="3,3"/>
            
            <!-- Axes labels -->
            <text x="${width/2}" y="${height-5}" fill="white" text-anchor="middle" font-size="14">Position x</text>
            <text x="10" y="${height/2}" fill="white" text-anchor="middle" font-size="14" transform="rotate(-90, 10, ${height/2})">Energy / Probability</text>
            
            <!-- Annotations -->
            <text x="${barrierX1 - 30}" y="${yScale(E/2)}" fill="white" font-size="12">Incident</text>
            <text x="${(barrierX1 + barrierX2)/2}" y="${yScale(V0) - 10}" fill="white" text-anchor="middle" font-size="12">Barrier</text>
            <text x="${barrierX2 + 30}" y="${yScale(E/2)}" fill="white" font-size="12">Transmitted</text>
            
            <!-- Legend -->
            <g transform="translate(${width-180}, 20)">
                <line x1="0" y1="0" x2="30" y2="0" stroke="#667eea" stroke-width="3"/>
                <text x="35" y="5" fill="white" font-size="12">|ψ(x)|²</text>
                
                <line x1="0" y1="20" x2="30" y2="20" stroke="#f5576c" stroke-width="3"/>
                <text x="35" y="25" fill="white" font-size="12">V(x)</text>
                
                <line x1="0" y1="40" x2="30" y2="40" stroke="#4ade80" stroke-width="2" stroke-dasharray="5,5"/>
                <text x="35" y="45" fill="white" font-size="12">E</text>
            </g>
        </svg>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
