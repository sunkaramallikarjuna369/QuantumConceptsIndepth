// Initialize controls
function initializeControls() {
    const potentialType = document.getElementById('potential-type');
    const energy = document.getElementById('energy');
    const time = document.getElementById('time');
    
    potentialType.addEventListener('change', updateVisualization);
    energy.addEventListener('input', updateVisualization);
    time.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const potentialType = document.getElementById('potential-type');
    const energy = document.getElementById('energy');
    const time = document.getElementById('time');
    
    switch(preset) {
        case 'free-particle':
            potentialType.value = 'free';
            energy.value = 2.0;
            time.value = 0;
            break;
        case 'square-well':
            potentialType.value = 'well';
            energy.value = 1.5;
            time.value = 0;
            break;
        case 'harmonic':
            potentialType.value = 'harmonic';
            energy.value = 1.0;
            time.value = 0;
            break;
    }
    
    updateVisualization();
}

// Calculate wavefunction for different potentials
function calculateWavefunction(potentialType, energy, time, numPoints = 200) {
    const xMin = -5;
    const xMax = 5;
    const dx = (xMax - xMin) / numPoints;
    
    const wavefunction = [];
    const potential = [];
    
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * dx;
        let psi_real = 0;
        let psi_imag = 0;
        let V = 0;
        
        switch(potentialType) {
            case 'free':
                // Free particle: plane wave
                const k = Math.sqrt(2 * energy);
                psi_real = Math.cos(k * x - energy * time);
                psi_imag = Math.sin(k * x - energy * time);
                V = 0;
                break;
                
            case 'step':
                // Step potential
                V = x > 0 ? 2.0 : 0;
                if (x < 0) {
                    const k1 = Math.sqrt(2 * energy);
                    psi_real = Math.cos(k1 * x - energy * time);
                    psi_imag = Math.sin(k1 * x - energy * time);
                } else {
                    if (energy > V) {
                        const k2 = Math.sqrt(2 * (energy - V));
                        psi_real = 0.5 * Math.cos(k2 * x - energy * time);
                        psi_imag = 0.5 * Math.sin(k2 * x - energy * time);
                    } else {
                        psi_real = Math.exp(-Math.sqrt(2 * (V - energy)) * x) * Math.cos(-energy * time);
                        psi_imag = Math.exp(-Math.sqrt(2 * (V - energy)) * x) * Math.sin(-energy * time);
                    }
                }
                break;
                
            case 'barrier':
                // Barrier potential
                V = (x > -1 && x < 1) ? 3.0 : 0;
                const k = Math.sqrt(2 * Math.abs(energy));
                if (x < -1 || x > 1) {
                    psi_real = Math.exp(-0.5 * x * x) * Math.cos(k * x - energy * time);
                    psi_imag = Math.exp(-0.5 * x * x) * Math.sin(k * x - energy * time);
                } else {
                    const decay = Math.exp(-0.5 * (x * x + 1));
                    psi_real = decay * Math.cos(-energy * time);
                    psi_imag = decay * Math.sin(-energy * time);
                }
                break;
                
            case 'well':
                // Infinite square well
                V = (x < -2 || x > 2) ? 10 : 0;
                if (x >= -2 && x <= 2) {
                    const n = Math.floor(energy) + 1;
                    const L = 4;
                    psi_real = Math.sqrt(2/L) * Math.sin(n * Math.PI * (x + 2) / L) * Math.cos(-energy * time);
                    psi_imag = Math.sqrt(2/L) * Math.sin(n * Math.PI * (x + 2) / L) * Math.sin(-energy * time);
                } else {
                    psi_real = 0;
                    psi_imag = 0;
                }
                break;
                
            case 'harmonic':
                // Harmonic oscillator (ground state approximation)
                V = 0.5 * x * x;
                const n = Math.floor(energy);
                const omega = 1.0;
                psi_real = Math.exp(-0.5 * x * x) * Math.cos(-omega * (n + 0.5) * time);
                psi_imag = Math.exp(-0.5 * x * x) * Math.sin(-omega * (n + 0.5) * time);
                break;
        }
        
        const prob = psi_real * psi_real + psi_imag * psi_imag;
        wavefunction.push({x, psi_real, psi_imag, prob});
        potential.push({x, V});
    }
    
    return {wavefunction, potential};
}

// Update visualization based on inputs
function updateVisualization() {
    const potentialType = document.getElementById('potential-type').value;
    const energy = parseFloat(document.getElementById('energy').value);
    const time = parseFloat(document.getElementById('time').value);
    
    // Update value displays
    document.getElementById('energy-value').textContent = energy.toFixed(1);
    document.getElementById('time-value').textContent = time.toFixed(1);
    
    // Calculate wavefunction
    const {wavefunction, potential} = calculateWavefunction(potentialType, energy, time);
    
    // Get potential name
    const potentialNames = {
        'free': 'Free Particle (V=0)',
        'step': 'Step Potential',
        'barrier': 'Barrier Potential',
        'well': 'Infinite Square Well',
        'harmonic': 'Harmonic Oscillator'
    };
    
    // Calculate some properties
    const maxProb = Math.max(...wavefunction.map(p => p.prob));
    const avgX = wavefunction.reduce((sum, p) => sum + p.x * p.prob, 0) / wavefunction.reduce((sum, p) => sum + p.prob, 0);
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Potential: ${potentialNames[potentialType]}</h4>
            <p><strong>Energy E = ${energy.toFixed(2)} eV</strong></p>
            <p><strong>Time t = ${time.toFixed(2)}</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Schrödinger Equation</h4>
            <p><strong>iℏ∂ψ/∂t = Ĥψ</strong></p>
            <p>Ĥ = -ℏ²/(2m)∇² + V(x)</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Wavefunction Properties</h4>
            <p><strong>⟨x⟩ ≈ ${avgX.toFixed(2)}</strong> (average position)</p>
            <p><strong>max|ψ|² = ${maxProb.toFixed(3)}</strong> (peak probability density)</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${time === 0 ? '→ Initial state at t=0' : `✓ Time-evolved state at t=${time.toFixed(1)}`}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(wavefunction, potential, potentialType);
}

// Update visual display
function updateVisualDisplay(wavefunction, potential, potentialType) {
    const viz = document.getElementById('visualization');
    
    // Create SVG visualization
    const width = 600;
    const height = 400;
    const padding = 40;
    
    const xMin = -5;
    const xMax = 5;
    const yMin = -0.5;
    const yMax = Math.max(3, ...wavefunction.map(p => p.prob * 5));
    
    const xScale = (x) => padding + (x - xMin) / (xMax - xMin) * (width - 2 * padding);
    const yScale = (y) => height - padding - (y - yMin) / (yMax - yMin) * (height - 2 * padding);
    
    // Build SVG paths
    const probPath = wavefunction.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.prob * 5)}`
    ).join(' ');
    
    const potentialPath = potential.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.V)}`
    ).join(' ');
    
    viz.innerHTML = `
        <svg width="${width}" height="${height}" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
            <!-- Grid -->
            <line x1="${padding}" y1="${yScale(0)}" x2="${width-padding}" y2="${yScale(0)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            
            <!-- Potential V(x) -->
            <path d="${potentialPath}" fill="none" stroke="#f5576c" stroke-width="2" opacity="0.6"/>
            
            <!-- Probability density |ψ|² -->
            <path d="${probPath}" fill="none" stroke="#667eea" stroke-width="3"/>
            
            <!-- Axes labels -->
            <text x="${width/2}" y="${height-5}" fill="white" text-anchor="middle" font-size="14">Position x</text>
            <text x="10" y="${height/2}" fill="white" text-anchor="middle" font-size="14" transform="rotate(-90, 10, ${height/2})">Probability / Potential</text>
            
            <!-- Legend -->
            <g transform="translate(${width-150}, 20)">
                <line x1="0" y1="0" x2="30" y2="0" stroke="#667eea" stroke-width="3"/>
                <text x="35" y="5" fill="white" font-size="12">|ψ(x,t)|²</text>
                
                <line x1="0" y1="20" x2="30" y2="20" stroke="#f5576c" stroke-width="2"/>
                <text x="35" y="25" fill="white" font-size="12">V(x)</text>
            </g>
        </svg>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
