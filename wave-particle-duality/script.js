// Wave-Particle Duality - Interactive Implementation

// State variables
let state = {
    experimentType: 'double-slit',
    slitSeparation: 5.0,
    slitWidth: 1.0,
    wavelength: 500,
    showParticles: true,
    particleCount: 0
};

// Canvas contexts
let interferenceCtx, intensityCtx;
let particles = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    initializeCanvases();
    updateVisualization();
    startParticleAnimation();
});

// Initialize input controls
function initializeControls() {
    // Experiment type selector
    document.getElementById('experiment-type').addEventListener('change', (e) => {
        state.experimentType = e.target.value;
        updateVisualization();
    });

    // Slit separation slider
    document.getElementById('slit-separation').addEventListener('input', (e) => {
        state.slitSeparation = parseFloat(e.target.value);
        document.getElementById('slit-separation-value').textContent = state.slitSeparation.toFixed(1);
        updateVisualization();
    });

    // Slit width slider
    document.getElementById('slit-width').addEventListener('input', (e) => {
        state.slitWidth = parseFloat(e.target.value);
        document.getElementById('slit-width-value').textContent = state.slitWidth.toFixed(1);
        updateVisualization();
    });

    // Wavelength slider
    document.getElementById('wavelength').addEventListener('input', (e) => {
        state.wavelength = parseInt(e.target.value);
        document.getElementById('wavelength-value').textContent = state.wavelength;
        updateVisualization();
    });

    // Show particles checkbox
    document.getElementById('show-particles').addEventListener('change', (e) => {
        state.showParticles = e.target.checked;
        if (!state.showParticles) {
            particles = [];
        }
        updateVisualization();
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPreset(btn.dataset.preset);
        });
    });
}

// Apply preset configurations
function applyPreset(preset) {
    switch(preset) {
        case 'wave':
            state.experimentType = 'double-slit';
            state.slitSeparation = 5.0;
            state.wavelength = 500;
            state.showParticles = false;
            break;
        case 'particle':
            state.experimentType = 'particle';
            state.showParticles = true;
            break;
        case 'interference':
            state.experimentType = 'double-slit';
            state.slitSeparation = 3.0;
            state.wavelength = 600;
            state.showParticles = true;
            break;
    }
    
    // Update UI
    document.getElementById('experiment-type').value = state.experimentType;
    document.getElementById('slit-separation').value = state.slitSeparation;
    document.getElementById('slit-separation-value').textContent = state.slitSeparation.toFixed(1);
    document.getElementById('wavelength').value = state.wavelength;
    document.getElementById('wavelength-value').textContent = state.wavelength;
    document.getElementById('show-particles').checked = state.showParticles;
    
    updateVisualization();
}

// Initialize canvases
function initializeCanvases() {
    const interferenceCanvas = document.getElementById('interference-canvas');
    const intensityCanvas = document.getElementById('intensity-canvas');
    
    interferenceCanvas.width = 600;
    interferenceCanvas.height = 400;
    intensityCanvas.width = 600;
    intensityCanvas.height = 200;
    
    interferenceCtx = interferenceCanvas.getContext('2d');
    intensityCtx = intensityCanvas.getContext('2d');
}

// Update all visualizations
function updateVisualization() {
    // Update display info
    const experimentNames = {
        'single-slit': 'Single Slit',
        'double-slit': 'Double Slit',
        'particle': 'Particle Detection'
    };
    document.getElementById('experiment-display').textContent = experimentNames[state.experimentType];
    document.getElementById('wavelength-display').textContent = `${state.wavelength} nm`;
    
    const fringeSpacing = state.wavelength / state.slitSeparation;
    document.getElementById('fringe-spacing').textContent = `${fringeSpacing.toFixed(2)} λ`;
    
    // Draw visualizations
    drawInterferencePattern();
    drawIntensityDistribution();
}

// Draw interference pattern
function drawInterferencePattern() {
    const canvas = interferenceCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    interferenceCtx.fillStyle = '#0a0a0a';
    interferenceCtx.fillRect(0, 0, width, height);
    
    // Draw slits
    drawSlits();
    
    // Draw interference pattern
    if (state.experimentType === 'double-slit' || state.experimentType === 'single-slit') {
        drawWavePattern();
    }
    
    // Draw particles if enabled
    if (state.showParticles) {
        drawParticles();
    }
}

// Draw slits
function drawSlits() {
    const canvas = interferenceCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    interferenceCtx.fillStyle = '#667eea';
    interferenceCtx.strokeStyle = '#667eea';
    interferenceCtx.lineWidth = 3;
    
    const slitX = width * 0.2;
    const centerY = height / 2;
    const slitHeight = state.slitWidth * 10;
    const separation = state.slitSeparation * 10;
    
    if (state.experimentType === 'double-slit') {
        // Draw two slits
        interferenceCtx.beginPath();
        interferenceCtx.moveTo(slitX, centerY - separation/2 - slitHeight/2);
        interferenceCtx.lineTo(slitX, centerY - separation/2 + slitHeight/2);
        interferenceCtx.stroke();
        
        interferenceCtx.beginPath();
        interferenceCtx.moveTo(slitX, centerY + separation/2 - slitHeight/2);
        interferenceCtx.lineTo(slitX, centerY + separation/2 + slitHeight/2);
        interferenceCtx.stroke();
    } else {
        // Draw single slit
        interferenceCtx.beginPath();
        interferenceCtx.moveTo(slitX, centerY - slitHeight/2);
        interferenceCtx.lineTo(slitX, centerY + slitHeight/2);
        interferenceCtx.stroke();
    }
}

// Draw wave interference pattern
function drawWavePattern() {
    const canvas = interferenceCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const screenX = width * 0.8;
    const numPoints = 200;
    
    for (let i = 0; i < numPoints; i++) {
        const y = (i / numPoints) * height;
        const centerY = height / 2;
        const dy = y - centerY;
        
        let intensity;
        if (state.experimentType === 'double-slit') {
            // Double slit interference
            const phase = (2 * Math.PI * state.slitSeparation * dy) / (state.wavelength * 10);
            intensity = Math.cos(phase / 2) ** 2;
        } else {
            // Single slit diffraction
            const phase = (Math.PI * state.slitWidth * dy) / (state.wavelength * 10);
            intensity = phase !== 0 ? (Math.sin(phase) / phase) ** 2 : 1;
        }
        
        // Draw intensity as brightness
        const brightness = Math.floor(intensity * 255);
        const color = wavelengthToRGB(state.wavelength);
        interferenceCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity})`;
        interferenceCtx.fillRect(screenX - 20, y, 40, 2);
    }
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => {
        const color = wavelengthToRGB(state.wavelength);
        interferenceCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
        interferenceCtx.beginPath();
        interferenceCtx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI);
        interferenceCtx.fill();
    });
}

// Draw intensity distribution graph
function drawIntensityDistribution() {
    const canvas = intensityCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    intensityCtx.fillStyle = '#0a0a0a';
    intensityCtx.fillRect(0, 0, width, height);
    
    // Draw axes
    intensityCtx.strokeStyle = '#667eea';
    intensityCtx.lineWidth = 2;
    intensityCtx.beginPath();
    intensityCtx.moveTo(50, height - 30);
    intensityCtx.lineTo(width - 30, height - 30);
    intensityCtx.moveTo(50, height - 30);
    intensityCtx.lineTo(50, 30);
    intensityCtx.stroke();
    
    // Draw intensity curve
    intensityCtx.strokeStyle = '#ff6b6b';
    intensityCtx.lineWidth = 3;
    intensityCtx.beginPath();
    
    const numPoints = 300;
    for (let i = 0; i < numPoints; i++) {
        const x = 50 + (i / numPoints) * (width - 80);
        const position = (i / numPoints - 0.5) * 20; // Position relative to center
        
        let intensity;
        if (state.experimentType === 'double-slit') {
            const phase = (2 * Math.PI * state.slitSeparation * position) / state.wavelength;
            intensity = Math.cos(phase / 2) ** 2;
        } else {
            const phase = (Math.PI * state.slitWidth * position) / state.wavelength;
            intensity = phase !== 0 ? (Math.sin(phase) / phase) ** 2 : 1;
        }
        
        const y = height - 30 - intensity * (height - 60);
        
        if (i === 0) {
            intensityCtx.moveTo(x, y);
        } else {
            intensityCtx.lineTo(x, y);
        }
    }
    intensityCtx.stroke();
    
    // Labels
    intensityCtx.fillStyle = '#e0e0e0';
    intensityCtx.font = '14px Arial';
    intensityCtx.fillText('Position', width / 2 - 30, height - 5);
    intensityCtx.save();
    intensityCtx.translate(15, height / 2);
    intensityCtx.rotate(-Math.PI / 2);
    intensityCtx.fillText('Intensity', 0, 0);
    intensityCtx.restore();
}

// Start particle animation
function startParticleAnimation() {
    setInterval(() => {
        if (state.showParticles && particles.length < 100) {
            addParticle();
        }
        updateParticles();
        drawInterferencePattern();
    }, 100);
}

// Add a new particle
function addParticle() {
    const canvas = interferenceCtx.canvas;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Determine landing position based on interference pattern
    let y;
    if (state.experimentType === 'double-slit') {
        // Sample from interference pattern
        const random = Math.random();
        let cumulative = 0;
        for (let i = 0; i < 100; i++) {
            const testY = (i / 100) * height;
            const dy = testY - centerY;
            const phase = (2 * Math.PI * state.slitSeparation * dy) / (state.wavelength * 10);
            const prob = Math.cos(phase / 2) ** 2;
            cumulative += prob / 100;
            if (random < cumulative) {
                y = testY;
                break;
            }
        }
    } else {
        y = centerY + (Math.random() - 0.5) * height * 0.8;
    }
    
    particles.push({
        x: canvas.width * 0.2,
        y: y || centerY,
        targetY: y || centerY,
        speed: 2
    });
    
    state.particleCount++;
    document.getElementById('particle-count').textContent = state.particleCount;
}

// Update particle positions
function updateParticles() {
    const canvas = interferenceCtx.canvas;
    const targetX = canvas.width * 0.8;
    
    particles = particles.filter(particle => {
        particle.x += particle.speed;
        return particle.x < targetX + 50;
    });
}

// Convert wavelength to RGB color
function wavelengthToRGB(wavelength) {
    let r, g, b;
    
    if (wavelength >= 400 && wavelength < 440) {
        r = -(wavelength - 440) / (440 - 400);
        g = 0;
        b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0;
        g = (wavelength - 440) / (490 - 440);
        b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0;
        g = 1;
        b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510);
        g = 1;
        b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1;
        g = -(wavelength - 645) / (645 - 580);
        b = 0;
    } else if (wavelength >= 645 && wavelength <= 700) {
        r = 1;
        g = 0;
        b = 0;
    } else {
        r = 0.5;
        g = 0.5;
        b = 0.5;
    }
    
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}
