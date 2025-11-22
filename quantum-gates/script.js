// Initialize controls
function initializeControls() {
    const param1 = document.getElementById('param1');
    const param2 = document.getElementById('param2');
    
    param1.addEventListener('input', updateVisualization);
    param2.addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Apply preset configurations
function applyPreset(preset) {
    const param1 = document.getElementById('param1');
    const param2 = document.getElementById('param2');
    
    switch(preset) {
        case 'default':
            param1.value = 0.5;
            param2.value = 0.5;
            break;
        case 'example1':
            param1.value = 0.3;
            param2.value = 0.7;
            break;
        case 'example2':
            param1.value = 0.8;
            param2.value = 0.2;
            break;
    }
    
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
