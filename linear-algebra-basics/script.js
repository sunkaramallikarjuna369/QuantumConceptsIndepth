// Initialize controls
function initializeControls() {
    const vectorX = document.getElementById('vector-x');
    const vectorY = document.getElementById('vector-y');
    const operation = document.getElementById('operation');
    
    vectorX.addEventListener('input', updateVisualization);
    vectorY.addEventListener('input', updateVisualization);
    operation.addEventListener('change', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const vectorX = document.getElementById('vector-x');
    const vectorY = document.getElementById('vector-y');
    
    switch(preset) {
        case 'unit-vector':
            vectorX.value = 0.707;
            vectorY.value = 0.707;
            break;
        case 'orthogonal':
            vectorX.value = 1.0;
            vectorY.value = 0.0;
            break;
        case 'basis':
            vectorX.value = 1.0;
            vectorY.value = 0.0;
            break;
    }
    
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const vx = parseFloat(document.getElementById('vector-x').value);
    const vy = parseFloat(document.getElementById('vector-y').value);
    const operation = document.getElementById('operation').value;
    
    // Update value displays
    document.getElementById('vector-x-value').textContent = vx.toFixed(1);
    document.getElementById('vector-y-value').textContent = vy.toFixed(1);
    
    // Calculate vector properties
    const norm = Math.sqrt(vx * vx + vy * vy);
    const isUnit = Math.abs(norm - 1.0) < 0.01;
    
    // Second vector for inner product (orthogonal to v1)
    const v2x = -vy;
    const v2y = vx;
    
    // Calculate operation result
    let resultVx, resultVy, resultDesc, resultValue;
    
    switch(operation) {
        case 'norm':
            resultVx = vx;
            resultVy = vy;
            resultValue = norm;
            resultDesc = `||v|| = √(${vx.toFixed(2)}² + ${vy.toFixed(2)}²) = ${norm.toFixed(3)}`;
            break;
        case 'normalize':
            if (norm > 0.01) {
                resultVx = vx / norm;
                resultVy = vy / norm;
                resultValue = 1.0;
                resultDesc = `v/||v|| = (${resultVx.toFixed(3)}, ${resultVy.toFixed(3)}) with ||v/||v|||| = 1`;
            } else {
                resultVx = 0;
                resultVy = 0;
                resultValue = 0;
                resultDesc = 'Cannot normalize zero vector';
            }
            break;
        case 'inner-product':
            resultVx = v2x;
            resultVy = v2y;
            resultValue = vx * v2x + vy * v2y;
            resultDesc = `⟨v₁|v₂⟩ = ${vx.toFixed(2)}·${v2x.toFixed(2)} + ${vy.toFixed(2)}·${v2y.toFixed(2)} = ${resultValue.toFixed(3)}`;
            break;
        case 'matrix-transform':
            // Apply Pauli X matrix (rotation)
            resultVx = vy;
            resultVy = vx;
            resultValue = Math.sqrt(resultVx * resultVx + resultVy * resultVy);
            resultDesc = `Av = σ_x·v = (${resultVx.toFixed(2)}, ${resultVy.toFixed(2)})`;
            break;
    }
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Vector v₁</h4>
            <p><strong>v₁ = (${vx.toFixed(2)}, ${vy.toFixed(2)})</strong></p>
            <p>Dirac notation: |v₁⟩ = ${vx.toFixed(2)}|0⟩ + ${vy.toFixed(2)}|1⟩</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Vector Properties</h4>
            <p><strong>Norm:</strong> ||v₁|| = ${norm.toFixed(3)}</p>
            <p><strong>Unit vector:</strong> ${isUnit ? '✓ Yes (||v|| = 1)' : '✗ No (||v|| ≠ 1)'}</p>
            ${operation === 'inner-product' ? `<p><strong>v₂:</strong> (${v2x.toFixed(2)}, ${v2y.toFixed(2)}) [orthogonal to v₁]</p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Operation: ${operation}</h4>
            <p><strong>${resultDesc}</strong></p>
            ${operation === 'normalize' && norm > 0.01 ? '<p>Normalization scales the vector to unit length</p>' : ''}
            ${operation === 'inner-product' ? `<p>Inner product = 0 means vectors are orthogonal</p>` : ''}
            ${operation === 'matrix-transform' ? '<p>Matrix σ_x swaps the components</p>' : ''}
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: #4ade80;">
                ${norm < 0.1 ? '⚠ Near zero vector - very small magnitude' : 
                  isUnit ? '✓ Unit vector - normalized state' :
                  norm > 2 ? '→ Large magnitude vector' :
                  '✓ General vector in 2D space'}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(vx, vy, resultVx, resultVy, operation, norm, v2x, v2y);
}

// Update visual display
function updateVisualDisplay(vx, vy, resultVx, resultVy, operation, norm, v2x, v2y) {
    const viz = document.getElementById('visualization');
    
    // Scale for visualization
    const scale = 80;
    const centerX = 250;
    const centerY = 250;
    
    const x1 = vx * scale;
    const y1 = -vy * scale;
    
    const x2 = resultVx * scale;
    const y2 = -resultVy * scale;
    
    const v2xScaled = v2x * scale;
    const v2yScaled = -v2y * scale;
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Vector Space Visualization</h4>
            
            <svg width="500" height="500" style="background: rgba(255,255,255,0.02); border-radius: 10px;">
                <!-- Axes -->
                <line x1="0" y1="${centerY}" x2="500" y2="${centerY}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                <line x1="${centerX}" y1="0" x2="${centerX}" y2="500" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                
                <!-- Axis labels -->
                <text x="480" y="${centerY - 10}" fill="rgba(255,255,255,0.5)" font-size="12">x</text>
                <text x="${centerX + 10}" y="20" fill="rgba(255,255,255,0.5)" font-size="12">y</text>
                
                <!-- Grid circles -->
                <circle cx="${centerX}" cy="${centerY}" r="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="5,5"/>
                <circle cx="${centerX}" cy="${centerY}" r="160" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="5,5"/>
                
                <!-- Second vector (for inner product) -->
                ${operation === 'inner-product' ? `
                    <line x1="${centerX}" y1="${centerY}" x2="${centerX + v2xScaled}" y2="${centerY + v2yScaled}" 
                          stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="5,5"/>
                    <circle cx="${centerX + v2xScaled}" cy="${centerY + v2yScaled}" r="6" fill="rgba(255,255,255,0.3)"/>
                    <text x="${centerX + v2xScaled + 15}" y="${centerY + v2yScaled}" fill="rgba(255,255,255,0.5)" font-size="12">v₂</text>
                ` : ''}
                
                <!-- Original vector v1 -->
                <defs>
                    <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
                    </marker>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="#f5576c" />
                    </marker>
                </defs>
                
                <line x1="${centerX}" y1="${centerY}" x2="${centerX + x1}" y2="${centerY + y1}" 
                      stroke="#667eea" stroke-width="3" marker-end="url(#arrowhead1)"/>
                <text x="${centerX + x1 + 15}" y="${centerY + y1}" fill="#667eea" font-size="14" font-weight="bold">v₁</text>
                
                <!-- Result vector (if different from original) -->
                ${operation !== 'norm' && operation !== 'inner-product' ? `
                    <line x1="${centerX}" y1="${centerY}" x2="${centerX + x2}" y2="${centerY + y2}" 
                          stroke="#f5576c" stroke-width="3" stroke-dasharray="5,5" marker-end="url(#arrowhead2)"/>
                    <text x="${centerX + x2 + 15}" y="${centerY + y2 + 20}" fill="#f5576c" font-size="14" font-weight="bold">
                        ${operation === 'normalize' ? 'v₁/||v₁||' : 'Av₁'}
                    </text>
                ` : ''}
                
                <!-- Norm arc -->
                ${norm > 0.1 ? `
                    <circle cx="${centerX}" cy="${centerY}" r="${norm * scale}" fill="none" stroke="rgba(102, 126, 234, 0.3)" stroke-width="1" stroke-dasharray="3,3"/>
                ` : ''}
            </svg>
            
            <div style="margin-top: 20px; display: flex; justify-content: space-around;">
                <div style="text-align: center;">
                    <div style="width: 20px; height: 20px; background: #667eea; border-radius: 3px; margin: 0 auto 5px;"></div>
                    <p style="margin: 0; font-size: 0.9em;">Original: v₁</p>
                </div>
                ${operation !== 'norm' && operation !== 'inner-product' ? `
                    <div style="text-align: center;">
                        <div style="width: 20px; height: 20px; background: #f5576c; border-radius: 3px; margin: 0 auto 5px;"></div>
                        <p style="margin: 0; font-size: 0.9em;">Result: ${operation === 'normalize' ? 'normalized' : 'transformed'}</p>
                    </div>
                ` : ''}
                ${operation === 'inner-product' ? `
                    <div style="text-align: center;">
                        <div style="width: 20px; height: 20px; background: rgba(255,255,255,0.3); border-radius: 3px; margin: 0 auto 5px;"></div>
                        <p style="margin: 0; font-size: 0.9em;">v₂ (orthogonal)</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
