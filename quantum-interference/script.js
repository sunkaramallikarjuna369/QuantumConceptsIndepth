// Initialize controls
function initializeControls() {
    const slitSeparation = document.getElementById('slit-separation');
    const wavelength = document.getElementById('wavelength');
    const phaseDifference = document.getElementById('phase-difference');
    
    slitSeparation.addEventListener('input', updateVisualization);
    wavelength.addEventListener('input', updateVisualization);
    phaseDifference.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const slitSeparation = document.getElementById('slit-separation');
    const wavelength = document.getElementById('wavelength');
    const phaseDifference = document.getElementById('phase-difference');
    
    switch(preset) {
        case 'constructive':
            slitSeparation.value = 50;
            wavelength.value = 500;
            phaseDifference.value = 0;
            break;
        case 'destructive':
            slitSeparation.value = 50;
            wavelength.value = 500;
            phaseDifference.value = Math.PI;
            break;
        case 'partial':
            slitSeparation.value = 50;
            wavelength.value = 500;
            phaseDifference.value = Math.PI / 2;
            break;
    }
    
    updateVisualization();
}

// Calculate interference pattern
function calculateInterferencePattern(d, lambda, phi, numPoints = 400) {
    const pattern = [];
    const yMin = -100; // Position on screen in arbitrary units
    const yMax = 100;
    const dy = (yMax - yMin) / numPoints;
    
    // Assume screen distance L = 1000 (arbitrary units)
    const L = 1000;
    
    for (let i = 0; i < numPoints; i++) {
        const y = yMin + i * dy;
        
        // Angle from center
        const theta = Math.atan(y / L);
        
        // Path difference
        const pathDiff = d * Math.sin(theta);
        
        // Phase difference from path + additional phase
        const phaseDiff = (2 * Math.PI * pathDiff / lambda) + phi;
        
        // Amplitude from each slit (assuming equal amplitudes)
        const a1 = 1.0;
        const a2 = 1.0;
        
        // Total amplitude (complex addition)
        const psi1_real = a1;
        const psi1_imag = 0;
        const psi2_real = a2 * Math.cos(phaseDiff);
        const psi2_imag = a2 * Math.sin(phaseDiff);
        
        const psi_total_real = psi1_real + psi2_real;
        const psi_total_imag = psi1_imag + psi2_imag;
        
        // Intensity (probability)
        const intensity = psi_total_real * psi_total_real + psi_total_imag * psi_total_imag;
        
        pattern.push({y, intensity, phaseDiff});
    }
    
    return pattern;
}

// Update visualization based on inputs
function updateVisualization() {
    const d = parseFloat(document.getElementById('slit-separation').value); // μm
    const lambda = parseFloat(document.getElementById('wavelength').value); // nm
    const phi = parseFloat(document.getElementById('phase-difference').value); // radians
    
    // Update value displays
    document.getElementById('slit-separation-value').textContent = d.toFixed(0);
    document.getElementById('wavelength-value').textContent = lambda.toFixed(0);
    document.getElementById('phase-difference-value').textContent = phi.toFixed(2);
    
    // Calculate interference pattern
    const pattern = calculateInterferencePattern(d, lambda / 1000, phi); // Convert nm to μm
    
    // Find max and min intensity
    const maxIntensity = Math.max(...pattern.map(p => p.intensity));
    const minIntensity = Math.min(...pattern.map(p => p.intensity));
    
    // Calculate visibility
    const visibility = (maxIntensity - minIntensity) / (maxIntensity + minIntensity);
    
    // Determine interference type
    const phiNormalized = phi % (2 * Math.PI);
    let interferenceType = '';
    let interferenceColor = '';
    
    if (Math.abs(phiNormalized) < 0.3 || Math.abs(phiNormalized - 2 * Math.PI) < 0.3) {
        interferenceType = 'Constructive Interference';
        interferenceColor = '#4ade80';
    } else if (Math.abs(phiNormalized - Math.PI) < 0.3) {
        interferenceType = 'Destructive Interference';
        interferenceColor = '#f5576c';
    } else {
        interferenceType = 'Partial Interference';
        interferenceColor = '#fbbf24';
    }
    
    // Calculate fringe spacing (approximate)
    const L = 1000; // Screen distance
    const fringeSpacing = (lambda / 1000) * L / d;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: ${interferenceColor};">${interferenceType}</h4>
            <p><strong>Slit Separation d = ${d.toFixed(0)} μm</strong></p>
            <p><strong>Wavelength λ = ${lambda.toFixed(0)} nm</strong></p>
            <p><strong>Phase Difference φ = ${phi.toFixed(2)} rad = ${(phi * 180 / Math.PI).toFixed(1)}°</strong></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Interference Pattern</h4>
            <p><strong>Max Intensity: ${maxIntensity.toFixed(3)}</strong></p>
            <p><strong>Min Intensity: ${minIntensity.toFixed(3)}</strong></p>
            <p><strong>Visibility V = ${visibility.toFixed(3)}</strong></p>
            <p>Fringe spacing ≈ ${fringeSpacing.toFixed(2)} units</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Quantum Principle</h4>
            <p>P = |ψ₁ + ψ₂|² = |ψ₁|² + |ψ₂|² + 2Re(ψ₁*ψ₂)</p>
            <p>Interference term: 2|ψ₁||ψ₂|cos(φ)</p>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${interferenceColor};">
                ${phiNormalized < 0.3 || Math.abs(phiNormalized - 2 * Math.PI) < 0.3 ? 
                    '✓ Amplitudes add coherently: P_max = 4|ψ|² (for equal amplitudes)' :
                  Math.abs(phiNormalized - Math.PI) < 0.3 ?
                    '→ Amplitudes cancel: P_min = 0 (complete destructive interference)' :
                    '→ Partial interference: 0 < P < P_max'
                }
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(pattern, maxIntensity, interferenceType);
}

// Update visual display
function updateVisualDisplay(pattern, maxIntensity, interferenceType) {
    const viz = document.getElementById('visualization');
    
    // Create SVG visualization
    const width = 600;
    const height = 400;
    const padding = 40;
    
    const yMin = -100;
    const yMax = 100;
    const intensityMax = maxIntensity * 1.1;
    
    const xScale = (intensity) => padding + (intensity / intensityMax) * (width - 2 * padding);
    const yScale = (y) => padding + (y - yMin) / (yMax - yMin) * (height - 2 * padding);
    
    // Build SVG path for intensity pattern
    const intensityPath = pattern.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(p.intensity)} ${yScale(p.y)}`
    ).join(' ');
    
    // Create filled area
    const filledPath = `M ${xScale(0)} ${yScale(yMin)} L ${intensityPath.substring(2)} L ${xScale(0)} ${yScale(yMax)} Z`;
    
    viz.innerHTML = `
        <svg width="${width}" height="${height}" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
            <!-- Grid -->
            <line x1="${xScale(0)}" y1="${padding}" x2="${xScale(0)}" y2="${height-padding}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            
            <!-- Filled intensity pattern -->
            <path d="${filledPath}" fill="rgba(102, 126, 234, 0.3)" stroke="none"/>
            
            <!-- Intensity curve -->
            <path d="${intensityPath}" fill="none" stroke="#667eea" stroke-width="3"/>
            
            <!-- Axes labels -->
            <text x="${width/2}" y="${height-5}" fill="white" text-anchor="middle" font-size="14">Intensity</text>
            <text x="10" y="${height/2}" fill="white" text-anchor="middle" font-size="14" transform="rotate(-90, 10, ${height/2})">Position on Screen</text>
            
            <!-- Title -->
            <text x="${width/2}" y="25" fill="white" text-anchor="middle" font-size="16" font-weight="bold">${interferenceType}</text>
            
            <!-- Annotations -->
            <text x="${width-100}" y="50" fill="white" font-size="12">Double-Slit</text>
            <text x="${width-100}" y="65" fill="white" font-size="12">Interference</text>
        </svg>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
