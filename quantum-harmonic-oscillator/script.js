// Hermite polynomials (first 6)
function hermite(n, x) {
    switch(n) {
        case 0: return 1;
        case 1: return 2 * x;
        case 2: return 4 * x * x - 2;
        case 3: return 8 * x * x * x - 12 * x;
        case 4: return 16 * x * x * x * x - 48 * x * x + 12;
        case 5: return 32 * x * x * x * x * x - 160 * x * x * x + 120 * x;
        default: return 0;
    }
}

// Factorial
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Initialize controls
function initializeControls() {
    const quantumNumber = document.getElementById('quantum-number');
    const omega = document.getElementById('omega');
    const time = document.getElementById('time');
    
    quantumNumber.addEventListener('input', updateVisualization);
    omega.addEventListener('input', updateVisualization);
    time.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const quantumNumber = document.getElementById('quantum-number');
    const omega = document.getElementById('omega');
    const time = document.getElementById('time');
    
    switch(preset) {
        case 'ground':
            quantumNumber.value = 0;
            omega.value = 1.0;
            time.value = 0;
            break;
        case 'first-excited':
            quantumNumber.value = 1;
            omega.value = 1.0;
            time.value = 0;
            break;
        case 'high-energy':
            quantumNumber.value = 4;
            omega.value = 1.0;
            time.value = 0;
            break;
    }
    
    updateVisualization();
}

// Calculate harmonic oscillator wavefunction
function calculateWavefunction(n, omega, time, numPoints = 200) {
    const xMin = -5;
    const xMax = 5;
    const dx = (xMax - xMin) / numPoints;
    
    const wavefunction = [];
    const potential = [];
    
    // Normalization constant
    const norm = Math.pow(omega / Math.PI, 0.25) / Math.sqrt(Math.pow(2, n) * factorial(n));
    
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * dx;
        
        // Potential V(x) = 0.5 * omega^2 * x^2 (using natural units where m=1, hbar=1)
        const V = 0.5 * omega * omega * x * x;
        
        // Wavefunction: psi_n(x) = N_n * H_n(sqrt(omega)*x) * exp(-omega*x^2/2)
        const xi = Math.sqrt(omega) * x;
        const H_n = hermite(n, xi);
        const gaussian = Math.exp(-omega * x * x / 2);
        const psi = norm * H_n * gaussian;
        
        // Time evolution: psi(x,t) = psi(x) * exp(-i*E*t) where E = omega*(n+0.5)
        const energy = omega * (n + 0.5);
        const phase = -energy * time;
        const psi_real = psi * Math.cos(phase);
        const psi_imag = psi * Math.sin(phase);
        const prob = psi * psi; // |psi|^2 is time-independent for energy eigenstates
        
        wavefunction.push({x, psi_real, psi_imag, prob, psi});
        potential.push({x, V});
    }
    
    return {wavefunction, potential};
}

// Update visualization based on inputs
function updateVisualization() {
    const n = parseInt(document.getElementById('quantum-number').value);
    const omega = parseFloat(document.getElementById('omega').value);
    const time = parseFloat(document.getElementById('time').value);
    
    // Update value displays
    document.getElementById('quantum-number-value').textContent = n;
    document.getElementById('omega-value').textContent = omega.toFixed(1);
    document.getElementById('time-value').textContent = time.toFixed(1);
    
    // Calculate wavefunction
    const {wavefunction, potential} = calculateWavefunction(n, omega, time);
    
    // Calculate energy
    const energy = omega * (n + 0.5);
    const zeroPointEnergy = 0.5 * omega;
    
    // Calculate expectation values
    const dx = 10 / 200;
    let avgX = 0;
    let avgX2 = 0;
    let norm = 0;
    
    for (const point of wavefunction) {
        avgX += point.x * point.prob * dx;
        avgX2 += point.x * point.x * point.prob * dx;
        norm += point.prob * dx;
    }
    
    avgX /= norm;
    avgX2 /= norm;
    const deltaX = Math.sqrt(avgX2 - avgX * avgX);
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Quantum State: n = ${n}</h4>
            <p><strong>Energy Eₙ = ℏω(n + ½) = ${energy.toFixed(3)}</strong></p>
            <p>Zero-point energy E₀ = ${zeroPointEnergy.toFixed(3)}</p>
            <p>Energy spacing ΔE = ℏω = ${omega.toFixed(3)}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Wavefunction Properties</h4>
            <p><strong>Number of nodes: ${n}</strong></p>
            <p><strong>⟨x⟩ = ${avgX.toFixed(3)}</strong> (average position)</p>
            <p><strong>Δx ≈ ${deltaX.toFixed(3)}</strong> (position uncertainty)</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Ladder Operators</h4>
            <p>â†|${n}⟩ = √${n+1}|${n+1}⟩ (creation)</p>
            <p>â|${n}⟩ = ${n > 0 ? `√${n}|${n-1}⟩` : '0'} (annihilation)</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${n === 0 ? '✓ Ground state: Pure Gaussian, minimum uncertainty' : 
                  n === 1 ? '→ First excited state: One node, antisymmetric' :
                  `→ Excited state: ${n} nodes, oscillates ${n+1} times`}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(wavefunction, potential, n, energy);
}

// Update visual display
function updateVisualDisplay(wavefunction, potential, n, energy) {
    const viz = document.getElementById('visualization');
    
    // Create SVG visualization
    const width = 600;
    const height = 400;
    const padding = 40;
    
    const xMin = -5;
    const xMax = 5;
    const yMin = -1;
    const yMax = Math.max(5, energy + 1);
    
    const xScale = (x) => padding + (x - xMin) / (xMax - xMin) * (width - 2 * padding);
    const yScale = (y) => height - padding - (y - yMin) / (yMax - yMin) * (height - 2 * padding);
    
    // Build SVG paths
    const probPath = wavefunction.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.prob * 3)}`
    ).join(' ');
    
    const potentialPath = potential.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.V)}`
    ).join(' ');
    
    const wavefunctionPath = wavefunction.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.psi * 2 + energy)}`
    ).join(' ');
    
    viz.innerHTML = `
        <svg width="${width}" height="${height}" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
            <!-- Grid -->
            <line x1="${padding}" y1="${yScale(0)}" x2="${width-padding}" y2="${yScale(0)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            
            <!-- Potential V(x) -->
            <path d="${potentialPath}" fill="none" stroke="#f5576c" stroke-width="2" opacity="0.6"/>
            
            <!-- Energy level -->
            <line x1="${padding}" y1="${yScale(energy)}" x2="${width-padding}" y2="${yScale(energy)}" stroke="#4ade80" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>
            
            <!-- Wavefunction ψ(x) (shifted to energy level) -->
            <path d="${wavefunctionPath}" fill="none" stroke="#667eea" stroke-width="2" opacity="0.8"/>
            
            <!-- Probability density |ψ|² -->
            <path d="${probPath}" fill="none" stroke="#667eea" stroke-width="3"/>
            
            <!-- Axes labels -->
            <text x="${width/2}" y="${height-5}" fill="white" text-anchor="middle" font-size="14">Position x</text>
            <text x="10" y="${height/2}" fill="white" text-anchor="middle" font-size="14" transform="rotate(-90, 10, ${height/2})">Energy / Probability</text>
            
            <!-- Legend -->
            <g transform="translate(${width-180}, 20)">
                <line x1="0" y1="0" x2="30" y2="0" stroke="#667eea" stroke-width="3"/>
                <text x="35" y="5" fill="white" font-size="12">|ψₙ(x)|²</text>
                
                <line x1="0" y1="20" x2="30" y2="20" stroke="#667eea" stroke-width="2" opacity="0.8"/>
                <text x="35" y="25" fill="white" font-size="12">ψₙ(x)</text>
                
                <line x1="0" y1="40" x2="30" y2="40" stroke="#f5576c" stroke-width="2"/>
                <text x="35" y="45" fill="white" font-size="12">V(x)</text>
                
                <line x1="0" y1="60" x2="30" y2="60" stroke="#4ade80" stroke-width="2" stroke-dasharray="5,5"/>
                <text x="35" y="65" fill="white" font-size="12">Eₙ</text>
            </g>
        </svg>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
