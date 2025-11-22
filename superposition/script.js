// Superposition Principle - Interactive Implementation

// State variables
let state = {
    alphaMag: 0.707,
    alphaPhase: 0,
    betaMag: 0.707,
    betaPhase: 0,
    autoNormalize: true
};

// Three.js scene variables
let scene, camera, renderer;
let blochSphere, stateVector, axes;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    initializeBlochSphere();
    updateVisualization();
});

// Initialize input controls
function initializeControls() {
    // Alpha magnitude slider
    const alphaMagSlider = document.getElementById('alpha-magnitude');
    const alphaMagValue = document.getElementById('alpha-value');
    alphaMagSlider.addEventListener('input', (e) => {
        state.alphaMag = parseFloat(e.target.value);
        alphaMagValue.textContent = state.alphaMag.toFixed(3);
        updateVisualization();
    });

    // Alpha phase slider
    const alphaPhaseSlider = document.getElementById('alpha-phase');
    const alphaPhaseValue = document.getElementById('alpha-phase-value');
    alphaPhaseSlider.addEventListener('input', (e) => {
        state.alphaPhase = parseFloat(e.target.value);
        alphaPhaseValue.textContent = state.alphaPhase.toFixed(2);
        updateVisualization();
    });

    // Beta magnitude slider
    const betaMagSlider = document.getElementById('beta-magnitude');
    const betaMagValue = document.getElementById('beta-value');
    betaMagSlider.addEventListener('input', (e) => {
        state.betaMag = parseFloat(e.target.value);
        betaMagValue.textContent = state.betaMag.toFixed(3);
        updateVisualization();
    });

    // Beta phase slider
    const betaPhaseSlider = document.getElementById('beta-phase');
    const betaPhaseValue = document.getElementById('beta-phase-value');
    betaPhaseSlider.addEventListener('input', (e) => {
        state.betaPhase = parseFloat(e.target.value);
        betaPhaseValue.textContent = state.betaPhase.toFixed(2);
        updateVisualization();
    });

    // Auto-normalize checkbox
    const autoNormalizeCheckbox = document.getElementById('auto-normalize');
    autoNormalizeCheckbox.addEventListener('change', (e) => {
        state.autoNormalize = e.target.checked;
        updateVisualization();
    });

    // Preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            applyPreset(preset);
        });
    });
}

// Apply preset states
function applyPreset(preset) {
    switch(preset) {
        case 'zero':
            state.alphaMag = 1;
            state.alphaPhase = 0;
            state.betaMag = 0;
            state.betaPhase = 0;
            break;
        case 'one':
            state.alphaMag = 0;
            state.alphaPhase = 0;
            state.betaMag = 1;
            state.betaPhase = 0;
            break;
        case 'plus':
            state.alphaMag = 0.707;
            state.alphaPhase = 0;
            state.betaMag = 0.707;
            state.betaPhase = 0;
            break;
        case 'minus':
            state.alphaMag = 0.707;
            state.alphaPhase = 0;
            state.betaMag = 0.707;
            state.betaPhase = Math.PI;
            break;
    }
    
    // Update sliders
    document.getElementById('alpha-magnitude').value = state.alphaMag;
    document.getElementById('alpha-value').textContent = state.alphaMag.toFixed(3);
    document.getElementById('alpha-phase').value = state.alphaPhase;
    document.getElementById('alpha-phase-value').textContent = state.alphaPhase.toFixed(2);
    document.getElementById('beta-magnitude').value = state.betaMag;
    document.getElementById('beta-value').textContent = state.betaMag.toFixed(3);
    document.getElementById('beta-phase').value = state.betaPhase;
    document.getElementById('beta-phase-value').textContent = state.betaPhase.toFixed(2);
    
    updateVisualization();
}

// Process: Normalize and calculate probabilities
function processState() {
    let alpha = state.alphaMag;
    let beta = state.betaMag;
    
    // Normalize if enabled
    if (state.autoNormalize) {
        const norm = Math.sqrt(alpha * alpha + beta * beta);
        if (norm > 0) {
            alpha = alpha / norm;
            beta = beta / norm;
        }
    }
    
    // Calculate probabilities
    const prob0 = alpha * alpha;
    const prob1 = beta * beta;
    
    // Calculate Bloch sphere angles
    const theta = 2 * Math.acos(Math.min(1, alpha));
    const phi = state.betaPhase - state.alphaPhase;
    
    return {
        alpha,
        beta,
        prob0,
        prob1,
        theta,
        phi,
        normalization: prob0 + prob1
    };
}

// Update all visualizations
function updateVisualization() {
    const processed = processState();
    
    // Update state equation
    const alphaStr = formatComplex(processed.alpha, state.alphaPhase);
    const betaStr = formatComplex(processed.beta, state.betaPhase);
    document.getElementById('state-equation').textContent = 
        `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}|1⟩`;
    
    // Update normalization info
    document.getElementById('state-info').textContent = 
        `Normalization: |α|² + |β|² = ${processed.normalization.toFixed(3)}`;
    
    // Update probability bars
    document.getElementById('prob-0-bar').style.height = `${processed.prob0 * 100}%`;
    document.getElementById('prob-0-value').textContent = `${(processed.prob0 * 100).toFixed(1)}%`;
    document.getElementById('prob-1-bar').style.height = `${processed.prob1 * 100}%`;
    document.getElementById('prob-1-value').textContent = `${(processed.prob1 * 100).toFixed(1)}%`;
    
    // Update Bloch sphere
    updateBlochSphere(processed.theta, processed.phi);
}

// Format complex number for display
function formatComplex(magnitude, phase) {
    if (Math.abs(phase) < 0.01) {
        return magnitude.toFixed(3);
    }
    const real = magnitude * Math.cos(phase);
    const imag = magnitude * Math.sin(phase);
    
    if (Math.abs(imag) < 0.01) {
        return real.toFixed(3);
    }
    
    const imagStr = imag >= 0 ? `+${imag.toFixed(3)}i` : `${imag.toFixed(3)}i`;
    return `(${real.toFixed(3)}${imagStr})`;
}

// Initialize Three.js Bloch sphere
function initializeBlochSphere() {
    const container = document.getElementById('bloch-sphere');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create Bloch sphere (wireframe)
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    blochSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(blochSphere);
    
    // Create axes
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);
    
    // Add axis labels (X, Y, Z)
    createAxisLabels();
    
    // Create state vector
    const vectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const vectorMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.5
    });
    stateVector = new THREE.Mesh(vectorGeometry, vectorMaterial);
    scene.add(stateVector);
    
    // Add arrow head
    const coneGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
    const coneMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.5
    });
    const arrowHead = new THREE.Mesh(coneGeometry, coneMaterial);
    arrowHead.position.y = 0.6;
    stateVector.add(arrowHead);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    animate();
}

// Create axis labels
function createAxisLabels() {
    // This is a simplified version - in production you'd use sprites or HTML overlays
    // For now, we'll just use the AxesHelper which shows colored lines
}

// Update Bloch sphere state vector
function updateBlochSphere(theta, phi) {
    if (!stateVector) return;
    
    // Convert spherical to Cartesian coordinates
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    
    // Position the vector
    stateVector.position.set(x * 0.5, z * 0.5, y * 0.5);
    
    // Rotate the vector to point from origin
    const direction = new THREE.Vector3(x, z, y).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    stateVector.setRotationFromQuaternion(quaternion);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Slowly rotate the Bloch sphere for better visualization
    if (blochSphere) {
        blochSphere.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}
