// Initialize controls
function initializeControls() {
    const realPart = document.getElementById('real-part');
    const imagPart = document.getElementById('imag-part');
    const operation = document.getElementById('operation');
    
    realPart.addEventListener('input', updateVisualization);
    imagPart.addEventListener('input', updateVisualization);
    operation.addEventListener('change', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const realPart = document.getElementById('real-part');
    const imagPart = document.getElementById('imag-part');
    
    switch(preset) {
        case 'unit-circle':
            realPart.value = 0.707;
            imagPart.value = 0.707;
            break;
        case 'real-axis':
            realPart.value = 1.5;
            imagPart.value = 0;
            break;
        case 'imag-axis':
            realPart.value = 0;
            imagPart.value = 1.5;
            break;
        case 'euler':
            realPart.value = 1.0;
            imagPart.value = 0;
            break;
    }
    
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const re = parseFloat(document.getElementById('real-part').value);
    const im = parseFloat(document.getElementById('imag-part').value);
    const operation = document.getElementById('operation').value;
    
    // Update value displays
    document.getElementById('real-part-value').textContent = re.toFixed(1);
    document.getElementById('imag-part-value').textContent = im.toFixed(1);
    
    // Calculate complex number properties
    const magnitude = Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    const phaseDeg = phase * 180 / Math.PI;
    
    // Calculate operation result
    let resultRe, resultIm, resultDesc;
    
    switch(operation) {
        case 'magnitude':
            resultRe = magnitude;
            resultIm = 0;
            resultDesc = `|z| = ${magnitude.toFixed(3)}`;
            break;
        case 'phase':
            resultRe = phase;
            resultIm = 0;
            resultDesc = `arg(z) = ${phase.toFixed(3)} rad = ${phaseDeg.toFixed(1)}°`;
            break;
        case 'conjugate':
            resultRe = re;
            resultIm = -im;
            resultDesc = `z* = ${resultRe.toFixed(2)} ${resultIm >= 0 ? '+' : ''}${resultIm.toFixed(2)}i`;
            break;
        case 'square':
            resultRe = re * re - im * im;
            resultIm = 2 * re * im;
            resultDesc = `z² = ${resultRe.toFixed(2)} ${resultIm >= 0 ? '+' : ''}${resultIm.toFixed(2)}i`;
            break;
    }
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Complex Number</h4>
            <p><strong>z = ${re.toFixed(2)} ${im >= 0 ? '+' : ''}${im.toFixed(2)}i</strong></p>
            <p>Cartesian form: (${re.toFixed(2)}, ${im.toFixed(2)})</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Properties</h4>
            <p><strong>Magnitude:</strong> |z| = √(${re.toFixed(2)}² + ${im.toFixed(2)}²) = ${magnitude.toFixed(3)}</p>
            <p><strong>Phase:</strong> arg(z) = ${phase.toFixed(3)} rad = ${phaseDeg.toFixed(1)}°</p>
            <p><strong>Polar form:</strong> z = ${magnitude.toFixed(3)}·e^(i·${phase.toFixed(3)})</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Selected Operation: ${operation}</h4>
            <p><strong>${resultDesc}</strong></p>
            ${operation === 'conjugate' ? '<p>Complex conjugate flips the sign of the imaginary part</p>' : ''}
            ${operation === 'square' ? '<p>Squaring: z² = (a+bi)² = (a²-b²) + 2abi</p>' : ''}
            ${operation === 'magnitude' ? '<p>Distance from origin in complex plane</p>' : ''}
            ${operation === 'phase' ? '<p>Angle from positive real axis (counterclockwise)</p>' : ''}
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${magnitude < 0.1 ? '⚠ Near zero - very small magnitude' : 
                  Math.abs(im) < 0.1 ? '→ Nearly real - small imaginary part' :
                  Math.abs(re) < 0.1 ? '↑ Nearly imaginary - small real part' :
                  '✓ General complex number with both real and imaginary parts'}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(re, im, resultRe, resultIm, operation, magnitude, phase);
}

// Update visual display
function updateVisualDisplay(re, im, resultRe, resultIm, operation, magnitude, phase) {
    const viz = document.getElementById('visualization');
    
    // Scale for visualization (map -2 to 2 range to -200 to 200 pixels)
    const scale = 100;
    const centerX = 250;
    const centerY = 250;
    
    const x = re * scale;
    const y = -im * scale; // Negative because SVG y-axis is inverted
    
    const resultX = resultRe * scale;
    const resultY = -resultIm * scale;
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Complex Plane Visualization</h4>
            
            <svg width="500" height="500" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
                <!-- Axes -->
                <line x1="0" y1="${centerY}" x2="500" y2="${centerY}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                <line x1="${centerX}" y1="0" x2="${centerX}" y2="500" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                
                <!-- Axis labels -->
                <text x="480" y="${centerY - 10}" fill="rgba(255,255,255,0.5)" font-size="12">Re</text>
                <text x="${centerX + 10}" y="20" fill="rgba(255,255,255,0.5)" font-size="12">Im</text>
                
                <!-- Grid circles -->
                <circle cx="${centerX}" cy="${centerY}" r="100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="5,5"/>
                <circle cx="${centerX}" cy="${centerY}" r="200" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="5,5"/>
                
                <!-- Original complex number -->
                <line x1="${centerX}" y1="${centerY}" x2="${centerX + x}" y2="${centerY + y}" 
                      stroke="url(#gradient1)" stroke-width="3"/>
                <circle cx="${centerX + x}" cy="${centerY + y}" r="8" fill="#667eea"/>
                
                <!-- Result (if different from original) -->
                ${operation !== 'magnitude' && operation !== 'phase' ? `
                    <line x1="${centerX}" y1="${centerY}" x2="${centerX + resultX}" y2="${centerY + resultY}" 
                          stroke="url(#gradient2)" stroke-width="3" stroke-dasharray="5,5"/>
                    <circle cx="${centerX + resultX}" cy="${centerY + resultY}" r="8" fill="#f5576c"/>
                ` : ''}
                
                <!-- Phase arc -->
                ${Math.abs(magnitude) > 0.1 ? `
                    <path d="M ${centerX + 50} ${centerY} A 50 50 0 0 ${im >= 0 ? 0 : 1} ${centerX + 50 * Math.cos(phase)} ${centerY - 50 * Math.sin(phase)}" 
                          fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                ` : ''}
                
                <!-- Gradients -->
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>
            
            <div style="margin-top: 20px; display: flex; justify-content: space-around;">
                <div style="text-align: center;">
                    <div style="width: 20px; height: 20px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 3px; margin: 0 auto 5px;"></div>
                    <p style="margin: 0; font-size: 0.9em;">Original: z</p>
                </div>
                ${operation !== 'magnitude' && operation !== 'phase' ? `
                    <div style="text-align: center;">
                        <div style="width: 20px; height: 20px; background: linear-gradient(90deg, #f093fb, #f5576c); border-radius: 3px; margin: 0 auto 5px;"></div>
                        <p style="margin: 0; font-size: 0.9em;">Result: ${operation === 'conjugate' ? 'z*' : operation === 'square' ? 'z²' : 'result'}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
