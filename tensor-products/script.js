// Initialize controls
function initializeControls() {
    const qubit1Alpha = document.getElementById('qubit1-alpha');
    const qubit2Alpha = document.getElementById('qubit2-alpha');
    const entangled = document.getElementById('entangled');
    
    qubit1Alpha.addEventListener('input', updateVisualization);
    qubit2Alpha.addEventListener('input', updateVisualization);
    entangled.addEventListener('change', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const qubit1Alpha = document.getElementById('qubit1-alpha');
    const qubit2Alpha = document.getElementById('qubit2-alpha');
    const entangled = document.getElementById('entangled');
    
    switch(preset) {
        case 'separable':
            qubit1Alpha.value = 0.707;
            qubit2Alpha.value = 0.707;
            entangled.checked = false;
            break;
        case 'product':
            qubit1Alpha.value = 1.0;
            qubit2Alpha.value = 0.0;
            entangled.checked = false;
            break;
        case 'bell':
            qubit1Alpha.value = 0.707;
            qubit2Alpha.value = 0.707;
            entangled.checked = true;
            break;
    }
    
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const alpha1 = parseFloat(document.getElementById('qubit1-alpha').value);
    const alpha2 = parseFloat(document.getElementById('qubit2-alpha').value);
    const isEntangled = document.getElementById('entangled').checked;
    
    const beta1 = Math.sqrt(1 - alpha1 * alpha1);
    const beta2 = Math.sqrt(1 - alpha2 * alpha2);
    
    // Update value displays
    document.getElementById('qubit1-alpha-value').textContent = alpha1.toFixed(3);
    document.getElementById('qubit2-alpha-value').textContent = alpha2.toFixed(3);
    
    // Calculate tensor product or Bell state
    let c00, c01, c10, c11;
    let stateType, stateDescription;
    
    if (isEntangled) {
        // Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
        c00 = 1 / Math.sqrt(2);
        c01 = 0;
        c10 = 0;
        c11 = 1 / Math.sqrt(2);
        stateType = 'Entangled (Bell State)';
        stateDescription = '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2';
    } else {
        // Separable state |ψ₁⟩ ⊗ |ψ₂⟩
        c00 = alpha1 * alpha2;
        c01 = alpha1 * beta2;
        c10 = beta1 * alpha2;
        c11 = beta1 * beta2;
        stateType = 'Separable (Product State)';
        stateDescription = `|ψ₁⟩ ⊗ |ψ₂⟩`;
    }
    
    // Calculate probabilities
    const prob00 = c00 * c00;
    const prob01 = c01 * c01;
    const prob10 = c10 * c10;
    const prob11 = c11 * c11;
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>Individual Qubits</h4>
            <p><strong>Qubit 1:</strong> |ψ₁⟩ = ${alpha1.toFixed(3)}|0⟩ + ${beta1.toFixed(3)}|1⟩</p>
            <p><strong>Qubit 2:</strong> |ψ₂⟩ = ${alpha2.toFixed(3)}|0⟩ + ${beta2.toFixed(3)}|1⟩</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Two-Qubit State</h4>
            <p><strong>Type:</strong> ${stateType}</p>
            <p><strong>State:</strong> ${stateDescription}</p>
            ${!isEntangled ? `
                <p><strong>Expanded:</strong> ${c00.toFixed(3)}|00⟩ + ${c01.toFixed(3)}|01⟩ + ${c10.toFixed(3)}|10⟩ + ${c11.toFixed(3)}|11⟩</p>
            ` : `
                <p><strong>Cannot be factored</strong> into |ψ₁⟩ ⊗ |ψ₂⟩</p>
            `}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4>Measurement Probabilities</h4>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|00⟩):</span>
                    <span><strong>${(prob00 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 15px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${prob00 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|01⟩):</span>
                    <span><strong>${(prob01 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 15px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f093fb, #f5576c); height: 100%; width: ${prob01 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|10⟩):</span>
                    <span><strong>${(prob10 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 15px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #4ade80, #3b82f6); height: 100%; width: ${prob10 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>P(|11⟩):</span>
                    <span><strong>${(prob11 * 100).toFixed(1)}%</strong></span>
                </div>
                <div style="background: rgba(255,255,255,0.1); height: 15px; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #fbbf24, #f59e0b); height: 100%; width: ${prob11 * 100}%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>
        
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <p style="margin: 0; color: ${isEntangled ? '#f5576c' : '#4ade80'};">
                ${isEntangled ? 
                    '⚠ Entangled state - measuring one qubit instantly affects the other' :
                    '✓ Separable state - qubits are independent'}
            </p>
        </div>
    `;
    
    // Update visualization
    updateVisualDisplay(c00, c01, c10, c11, isEntangled);
}

// Update visual display
function updateVisualDisplay(c00, c01, c10, c11, isEntangled) {
    const viz = document.getElementById('visualization');
    
    // Calculate bar heights (amplitudes)
    const maxAmplitude = Math.max(Math.abs(c00), Math.abs(c01), Math.abs(c10), Math.abs(c11));
    const scale = maxAmplitude > 0 ? 200 / maxAmplitude : 1;
    
    const h00 = Math.abs(c00) * scale;
    const h01 = Math.abs(c01) * scale;
    const h10 = Math.abs(c10) * scale;
    const h11 = Math.abs(c11) * scale;
    
    viz.innerHTML = `
        <div style="padding: 20px;">
            <h4 style="text-align: center; margin-bottom: 20px;">Tensor Product State Amplitudes</h4>
            
            <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 250px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 10px;">
                <div style="text-align: center;">
                    <div style="width: 60px; height: ${h00}px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 5px 5px 0 0; margin: 0 auto; transition: height 0.3s;"></div>
                    <p style="margin-top: 10px; font-weight: bold;">|00⟩</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #888;">${c00.toFixed(3)}</p>
                </div>
                
                <div style="text-align: center;">
                    <div style="width: 60px; height: ${h01}px; background: linear-gradient(180deg, #f093fb, #f5576c); border-radius: 5px 5px 0 0; margin: 0 auto; transition: height 0.3s;"></div>
                    <p style="margin-top: 10px; font-weight: bold;">|01⟩</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #888;">${c01.toFixed(3)}</p>
                </div>
                
                <div style="text-align: center;">
                    <div style="width: 60px; height: ${h10}px; background: linear-gradient(180deg, #4ade80, #3b82f6); border-radius: 5px 5px 0 0; margin: 0 auto; transition: height 0.3s;"></div>
                    <p style="margin-top: 10px; font-weight: bold;">|10⟩</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #888;">${c10.toFixed(3)}</p>
                </div>
                
                <div style="text-align: center;">
                    <div style="width: 60px; height: ${h11}px; background: linear-gradient(180deg, #fbbf24, #f59e0b); border-radius: 5px 5px 0 0; margin: 0 auto; transition: height 0.3s;"></div>
                    <p style="margin-top: 10px; font-weight: bold;">|11⟩</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #888;">${c11.toFixed(3)}</p>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <p style="margin: 0; text-align: center; color: ${isEntangled ? '#f5576c' : '#4ade80'};">
                    ${isEntangled ? 
                        'Bell state: Only |00⟩ and |11⟩ have non-zero amplitudes' :
                        'Product state: All four basis states may have non-zero amplitudes'}
                </p>
            </div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
