// Initialize controls
function initializeControls() {
    const lQuantum = document.getElementById('l-quantum');
    const mQuantum = document.getElementById('m-quantum');
    const theta = document.getElementById('theta');
    
    lQuantum.addEventListener('change', () => {
        updateMOptions();
        updateVisualization();
    });
    mQuantum.addEventListener('change', updateVisualization);
    theta.addEventListener('input', updateVisualization);
    
    updateMOptions();
    updateVisualization();
}

// Update m quantum number options based on l
function updateMOptions() {
    const l = parseInt(document.getElementById('l-quantum').value);
    const mSelect = document.getElementById('m-quantum');
    
    mSelect.innerHTML = '';
    for (let m = -l; m <= l; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = `m = ${m}`;
        if (m === 0) option.selected = true;
        mSelect.appendChild(option);
    }
}

// Apply preset configurations
function applyPreset(preset) {
    const lQuantum = document.getElementById('l-quantum');
    const theta = document.getElementById('theta');
    
    switch(preset) {
        case 's-orbital':
            lQuantum.value = 0;
            theta.value = 45;
            break;
        case 'p-orbital':
            lQuantum.value = 1;
            theta.value = 45;
            break;
        case 'd-orbital':
            lQuantum.value = 2;
            theta.value = 45;
            break;
    }
    
    updateMOptions();
    updateVisualization();
}

// Update visualization based on inputs
function updateVisualization() {
    const param1 = parseFloat(document.getElementById('param1').value);
    const param2 = parseFloat(document.getElementById('param2').value);
    
    // Update value displays
    document.getElementById('param1-value').textContent = param1.toFixed(2);
    document.getElementById('param2-value').textContent = param2.toFixed(2);
    
    // Update results
    const results = document.getElementById('results');
    results.innerHTML = `
        <p><strong>Parameter 1:</strong> ${param1.toFixed(3)}</p>
        <p><strong>Parameter 2:</strong> ${param2.toFixed(3)}</p>
        <p><strong>Combined Effect:</strong> ${(param1 * param2).toFixed(3)}</p>
    `;
    
    // Update visualization
    updateVisualDisplay(param1, param2);
}

// Update visual display
function updateVisualDisplay(param1, param2) {
    const viz = document.getElementById('visualization');
    viz.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <p>Visualization for parameters: ${param1.toFixed(2)}, ${param2.toFixed(2)}</p>
            <div style="margin: 20px auto; width: 200px; height: 200px; background: linear-gradient(135deg, rgba(102, 126, 234, ${param1}) 0%, rgba(118, 75, 162, ${param2}) 100%); border-radius: 10px;"></div>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeControls);
