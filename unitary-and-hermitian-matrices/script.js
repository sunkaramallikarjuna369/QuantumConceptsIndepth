// Matrix definitions
const matrices = {
    'hadamard': {
        name: 'Hadamard (H)',
        matrix: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
        isUnitary: true,
        isHermitian: true,
        eigenvalues: [1, -1]
    },
    'pauli-x': {
        name: 'Pauli-X (σₓ)',
        matrix: [[0, 1], [1, 0]],
        isUnitary: true,
        isHermitian: true,
        eigenvalues: [1, -1]
    },
    'pauli-y': {
        name: 'Pauli-Y (σᵧ)',
        matrix: [[0, {re: 0, im: -1}], [{re: 0, im: 1}, 0]],
        isUnitary: true,
        isHermitian: true,
        eigenvalues: [1, -1]
    },
    'pauli-z': {
        name: 'Pauli-Z (σᵤ)',
        matrix: [[1, 0], [0, -1]],
        isUnitary: true,
        isHermitian: true,
        eigenvalues: [1, -1]
    },
    'phase': {
        name: 'Phase (S)',
        matrix: [[1, 0], [0, {re: 0, im: 1}]],
        isUnitary: true,
        isHermitian: false,
        eigenvalues: [{re: 1, im: 0}, {re: 0, im: 1}]
    },
    't-gate': {
        name: 'T Gate',
        matrix: [[1, 0], [0, {re: Math.cos(Math.PI/4), im: Math.sin(Math.PI/4)}]],
        isUnitary: true,
        isHermitian: false,
        eigenvalues: [{re: 1, im: 0}, {re: Math.cos(Math.PI/4), im: Math.sin(Math.PI/4)}]
    }
};

// Initialize controls
function initializeControls() {
    const matrixType = document.getElementById('matrix-type');
    const gateSelect = document.getElementById('gate-select');
    const rotationAngle = document.getElementById('rotation-angle');
    
    matrixType.addEventListener('change', updateVisualization);
    gateSelect.addEventListener('change', updateVisualization);
    rotationAngle.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const gateSelect = document.getElementById('gate-select');
    
    gateSelect.value = preset;
    updateVisualization();
}

// Format complex number
function formatComplex(val) {
    if (typeof val === 'number') {
        return val.toFixed(3);
    }
    if (val.im === 0) {
        return val.re.toFixed(3);
    }
    if (val.re === 0) {
        return `${val.im.toFixed(3)}i`;
    }
    return `${val.re.toFixed(3)} + ${val.im.toFixed(3)}i`;
}

// Update visualization based on inputs
function updateVisualization() {
    const matrixType = document.getElementById('matrix-type').value;
    const gateSelect = document.getElementById('gate-select').value;
    const rotationAngle = parseFloat(document.getElementById('rotation-angle').value);
    
    // Update value displays
    document.getElementById('rotation-angle-value').textContent = rotationAngle.toFixed(2);
    
    const matrixData = matrices[gateSelect];
    const matrix = matrixData.matrix;
    
    // Format matrix elements
    const m00 = formatComplex(matrix[0][0]);
    const m01 = formatComplex(matrix[0][1]);
    const m10 = formatComplex(matrix[1][0]);
    const m11 = formatComplex(matrix[1][1]);
    
    // Check properties
    const isUnitary = matrixData.isUnitary;
    const isHermitian = matrixData.isHermitian;
    const isBoth = isUnitary && isHermitian;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Selected Matrix: ${matrixData.name}</h4>
            <div style="font-family: monospace; font-size: 1.1em; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                ⎡ ${m00.padEnd(12)} ${m01.padEnd(12)} ⎤<br>
                ⎣ ${m10.padEnd(12)} ${m11.padEnd(12)} ⎦
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Matrix Properties</h4>
            <p><strong>Unitary:</strong> ${isUnitary ? '✓ Yes (Û†Û = I)' : '✗ No'}</p>
            <p><strong>Hermitian:</strong> ${isHermitian ? '✓ Yes († = Â)' : '✗ No'}</p>
            ${isBoth ? '<p style="color: #4ade80;"><strong>Both Unitary and Hermitian!</strong> (Self-inverse gate and observable)</p>' : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Physical Interpretation</h4>
            ${isUnitary ? '<p>✓ Can be used as a <strong>quantum gate</strong> (reversible operation)</p>' : ''}
            ${isHermitian ? '<p>✓ Can represent an <strong>observable</strong> (measurable quantity)</p>' : ''}
            ${isUnitary && !isHermitian ? '<p>→ Pure quantum gate (not self-inverse)</p>' : ''}
            ${!isUnitary && isHermitian ? '<p>→ Pure observable (not a valid gate)</p>' : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Eigenvalues</h4>
            <p><strong>λ₁:</strong> ${formatComplex(matrixData.eigenvalues[0])}</p>
            <p><strong>λ₂:</strong> ${formatComplex(matrixData.eigenvalues[1])}</p>
            ${isHermitian ? '<p style="color: #4ade80;">All eigenvalues are real (Hermitian property)</p>' : ''}
            ${isUnitary ? '<p style="color: #4ade80;">All eigenvalues have |λ| = 1 (Unitary property)</p>' : ''}
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${isBoth ? '#4ade80' : isUnitary ? '#667eea' : '#f5576c'};">
                ${isBoth ? '✓ Self-inverse: Applying twice returns to original state' :
                  isUnitary ? '→ Reversible: Can be undone by applying Û†' :
                  '→ Observable only: Represents a measurable quantity'}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(matrix, matrixData.name, isUnitary, isHermitian);
}

// Update visual display
function updateVisualDisplay(matrix, name, isUnitary, isHermitian) {
    const viz = document.getElementById('visualization');
    
    // Format matrix elements for display
    const m00 = formatComplex(matrix[0][0]);
    const m01 = formatComplex(matrix[0][1]);
    const m10 = formatComplex(matrix[1][0]);
    const m11 = formatComplex(matrix[1][1]);
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Matrix Visualization</h4>
            
            <div style="display: flex; justify-content: center; margin-bottom: 30px;">
                <div style="font-family: monospace; font-size: 1.5em; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 2px solid ${isUnitary && isHermitian ? '#4ade80' : isUnitary ? '#667eea' : '#f5576c'};">
                    <div style="display: grid; grid-template-columns: auto auto; gap: 20px;">
                        <div style="text-align: center; padding: 15px; background: rgba(102, 126, 234, 0.2); border-radius: 8px;">
                            ${m00}
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(102, 126, 234, 0.2); border-radius: 8px;">
                            ${m01}
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(102, 126, 234, 0.2); border-radius: 8px;">
                            ${m10}
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(102, 126, 234, 0.2); border-radius: 8px;">
                            ${m11}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-around; margin-top: 30px;">
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; flex: 1; margin: 0 10px;">
                    <div style="width: 40px; height: 40px; background: ${isUnitary ? '#667eea' : 'rgba(255,255,255,0.2)'}; border-radius: 50%; margin: 0 auto 10px;"></div>
                    <p style="margin: 0; font-weight: bold;">Unitary</p>
                    <p style="margin: 5px 0 0; font-size: 0.9em; color: #888;">${isUnitary ? 'Yes' : 'No'}</p>
                </div>
                
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; flex: 1; margin: 0 10px;">
                    <div style="width: 40px; height: 40px; background: ${isHermitian ? '#f5576c' : 'rgba(255,255,255,0.2)'}; border-radius: 50%; margin: 0 auto 10px;"></div>
                    <p style="margin: 0; font-weight: bold;">Hermitian</p>
                    <p style="margin: 5px 0 0; font-size: 0.9em; color: #888;">${isHermitian ? 'Yes' : 'No'}</p>
                </div>
                
                <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; flex: 1; margin: 0 10px;">
                    <div style="width: 40px; height: 40px; background: ${isUnitary && isHermitian ? '#4ade80' : 'rgba(255,255,255,0.2)'}; border-radius: 50%; margin: 0 auto 10px;"></div>
                    <p style="margin: 0; font-weight: bold;">Both</p>
                    <p style="margin: 5px 0 0; font-size: 0.9em; color: #888;">${isUnitary && isHermitian ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
