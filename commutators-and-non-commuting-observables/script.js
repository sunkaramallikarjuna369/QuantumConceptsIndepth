// Operator matrices (Pauli matrices)
const operators = {
    'x': { name: 'σ_x', matrix: [[0, 1], [1, 0]], symbol: 'X' },
    'y': { name: 'σ_y', matrix: [[0, -1], [1, 0]], symbol: 'Y' }, // Simplified (imaginary handled separately)
    'z': { name: 'σ_z', matrix: [[1, 0], [0, -1]], symbol: 'Z' },
    'position': { name: 'x̂', matrix: null, symbol: 'x̂' },
    'momentum': { name: 'p̂', matrix: null, symbol: 'p̂' }
};

// Initialize controls
function initializeControls() {
    const operatorA = document.getElementById('operator-a');
    const operatorB = document.getElementById('operator-b');
    const orderToggle = document.getElementById('order-toggle');
    
    operatorA.addEventListener('change', updateVisualization);
    operatorB.addEventListener('change', updateVisualization);
    orderToggle.addEventListener('change', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const operatorA = document.getElementById('operator-a');
    const operatorB = document.getElementById('operator-b');
    
    switch(preset) {
        case 'pauli-xy':
            operatorA.value = 'x';
            operatorB.value = 'y';
            break;
        case 'pauli-xz':
            operatorA.value = 'x';
            operatorB.value = 'z';
            break;
        case 'position-momentum':
            operatorA.value = 'position';
            operatorB.value = 'momentum';
            break;
    }
    
    updateVisualization();
}

// Calculate commutator
function calculateCommutator() {
    document.getElementById('order-toggle').value = 'commutator';
    updateVisualization();
}

// Matrix multiplication (2x2)
function multiplyMatrices(A, B) {
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ];
}

// Matrix subtraction (2x2)
function subtractMatrices(A, B) {
    return [
        [A[0][0] - B[0][0], A[0][1] - B[0][1]],
        [A[1][0] - B[1][0], A[1][1] - B[1][1]]
    ];
}

// Check if matrix is zero
function isZeroMatrix(M) {
    return Math.abs(M[0][0]) < 0.001 && Math.abs(M[0][1]) < 0.001 &&
           Math.abs(M[1][0]) < 0.001 && Math.abs(M[1][1]) < 0.001;
}

// Update visualization based on inputs
function updateVisualization() {
    const operatorAKey = document.getElementById('operator-a').value;
    const operatorBKey = document.getElementById('operator-b').value;
    const order = document.getElementById('order-toggle').value;
    
    const opA = operators[operatorAKey];
    const opB = operators[operatorBKey];
    
    let resultMatrix, resultName, commutes, commutatorValue;
    
    // Handle position-momentum special case
    if ((operatorAKey === 'position' && operatorBKey === 'momentum') ||
        (operatorAKey === 'momentum' && operatorBKey === 'position')) {
        commutes = false;
        commutatorValue = 'iℏ';
        resultMatrix = null;
        resultName = order === 'commutator' ? '[x̂,p̂] = iℏ' : 
                     order === 'ab' ? 'x̂p̂' : 'p̂x̂';
    } else if (operatorAKey === operatorBKey) {
        // Same operator always commutes with itself
        commutes = true;
        commutatorValue = '0';
        resultMatrix = opA.matrix;
        resultName = order === 'commutator' ? `[${opA.symbol},${opA.symbol}] = 0` :
                     `${opA.symbol}²`;
    } else if (opA.matrix && opB.matrix) {
        // Calculate for Pauli matrices
        const AB = multiplyMatrices(opA.matrix, opB.matrix);
        const BA = multiplyMatrices(opB.matrix, opA.matrix);
        const commutator = subtractMatrices(AB, BA);
        
        commutes = isZeroMatrix(commutator);
        commutatorValue = commutes ? '0' : getCommutatorValue(operatorAKey, operatorBKey);
        
        if (order === 'ab') {
            resultMatrix = AB;
            resultName = `${opA.symbol}${opB.symbol}`;
        } else if (order === 'ba') {
            resultMatrix = BA;
            resultName = `${opB.symbol}${opA.symbol}`;
        } else {
            resultMatrix = commutator;
            resultName = `[${opA.symbol},${opB.symbol}]`;
        }
    }
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Selected Operators</h4>
            <p><strong>Â = ${opA.name}</strong></p>
            <p><strong>B̂ = ${opB.name}</strong></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Commutator</h4>
            <p><strong>[Â,B̂] = ${commutatorValue}</strong></p>
            <p style="color: ${commutes ? '#4ade80' : '#f5576c'};">
                ${commutes ? '✓ These operators commute' : '✗ These operators do NOT commute'}
            </p>
        </div>
        <div style="margin-bottom: 20px;">
            <h4>Physical Meaning</h4>
            <p>${getPhysicalMeaning(operatorAKey, operatorBKey, commutes)}</p>
        </div>
        <div>
            <p style="color: #888; font-size: 0.9em;">
                ${order === 'commutator' ? 'Showing commutator [Â,B̂] = ÂB̂ - B̂Â' :
                  order === 'ab' ? 'Showing ÂB̂ (apply A then B)' :
                  'Showing B̂Â (apply B then A)'}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(resultMatrix, resultName, commutes);
}

// Get known commutator values
function getCommutatorValue(opA, opB) {
    const pairs = {
        'xy': '2iσ_z', 'yx': '-2iσ_z',
        'yz': '2iσ_x', 'zy': '-2iσ_x',
        'zx': '2iσ_y', 'xz': '-2iσ_y'
    };
    return pairs[opA + opB] || 'non-zero';
}

// Get physical meaning
function getPhysicalMeaning(opA, opB, commutes) {
    if (opA === opB) {
        return 'An operator always commutes with itself. You can measure it multiple times with consistent results.';
    }
    if ((opA === 'position' && opB === 'momentum') || (opA === 'momentum' && opB === 'position')) {
        return 'Position and momentum are canonical conjugate variables. Their non-zero commutator [x̂,p̂] = iℏ is the origin of the Heisenberg uncertainty principle.';
    }
    if (commutes) {
        return 'These operators can be measured simultaneously with arbitrary precision. They share a common set of eigenstates.';
    } else {
        return 'These operators cannot be measured simultaneously with arbitrary precision. Measuring one affects the outcome of measuring the other.';
    }
}

// Update visual display
function updateVisualDisplay(matrix, name, commutes) {
    const viz = document.getElementById('visualization');
    
    if (!matrix) {
        viz.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h4 style="margin-bottom: 20px;">${name}</h4>
                <div style="padding: 40px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 20px 0;">
                    <p style="font-size: 1.2em; color: ${commutes ? '#4ade80' : '#f5576c'};">
                        ${commutes ? 'Operators Commute' : 'Operators Do NOT Commute'}
                    </p>
                    <p style="margin-top: 20px; color: #888;">
                        Position and momentum are continuous observables<br>
                        represented by infinite-dimensional operators
                    </p>
                </div>
            </div>
        `;
    } else {
        viz.innerHTML = `
            <div style="padding: 20px;">
                <h4 style="text-align: center; margin-bottom: 20px;">Result: ${name}</h4>
                
                <div style="display: flex; justify-content: center; margin: 30px 0;">
                    <div style="display: grid; grid-template-columns: repeat(2, 100px); gap: 2px; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                            ${matrix[0][0].toFixed(2)}
                        </div>
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                            ${matrix[0][1].toFixed(2)}
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                            ${matrix[1][0].toFixed(2)}
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 20px; border-radius: 5px; text-align: center; font-weight: bold;">
                            ${matrix[1][1].toFixed(2)}
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <p style="margin: 0; font-size: 0.9em; color: ${commutes ? '#4ade80' : '#f5576c'};">
                        ${commutes ? '✓ Commutator is zero - operators commute' : '✗ Commutator is non-zero - operators don\'t commute'}
                    </p>
                </div>
            </div>
        `;
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
