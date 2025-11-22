/**
 * Reusable UI Components and Utilities
 * Common functions for quantum visualization interfaces
 */

/**
 * Update probability bars visualization
 * @param {string} bar0Id - ID of the first probability bar element
 * @param {string} value0Id - ID of the first probability value text element
 * @param {string} bar1Id - ID of the second probability bar element
 * @param {string} value1Id - ID of the second probability value text element
 * @param {number} prob0 - Probability value for first state (0 to 1)
 * @param {number} prob1 - Probability value for second state (0 to 1)
 */
function updateProbabilityBars(bar0Id, value0Id, bar1Id, value1Id, prob0, prob1) {
    const bar0 = document.getElementById(bar0Id);
    const value0 = document.getElementById(value0Id);
    const bar1 = document.getElementById(bar1Id);
    const value1 = document.getElementById(value1Id);
    
    if (bar0) bar0.style.height = `${prob0 * 100}%`;
    if (value0) value0.textContent = `${(prob0 * 100).toFixed(1)}%`;
    if (bar1) bar1.style.height = `${prob1 * 100}%`;
    if (value1) value1.textContent = `${(prob1 * 100).toFixed(1)}%`;
}

/**
 * Format a complex number for display
 * @param {number} magnitude - Magnitude of the complex number
 * @param {number} phase - Phase angle in radians
 * @returns {string} Formatted complex number string
 */
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

/**
 * Create a slider control with automatic value display updates
 * @param {string} sliderId - ID of the slider input element
 * @param {string} valueId - ID of the value display element
 * @param {function} callback - Callback function when value changes
 * @param {number} decimals - Number of decimal places to display (default: 3)
 */
function bindSlider(sliderId, valueId, callback, decimals = 3) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!slider || !valueDisplay) {
        console.error(`Slider ${sliderId} or value display ${valueId} not found`);
        return;
    }
    
    slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        valueDisplay.textContent = value.toFixed(decimals);
        if (callback) callback(value);
    });
    
    // Initialize display
    valueDisplay.textContent = parseFloat(slider.value).toFixed(decimals);
}

/**
 * Bind multiple sliders at once
 * @param {Array} sliders - Array of {sliderId, valueId, callback, decimals} objects
 */
function bindSliders(sliders) {
    sliders.forEach(({sliderId, valueId, callback, decimals}) => {
        bindSlider(sliderId, valueId, callback, decimals);
    });
}

/**
 * Create preset button handlers
 * @param {string} buttonSelector - CSS selector for preset buttons
 * @param {function} callback - Callback function with preset name
 */
function bindPresetButtons(buttonSelector, callback) {
    const buttons = document.querySelectorAll(buttonSelector);
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (callback) callback(preset);
        });
    });
}

/**
 * Update a text element with formatted content
 * @param {string} elementId - ID of the element to update
 * @param {string} content - Content to set
 */
function updateText(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    }
}

/**
 * Normalize two amplitudes to ensure |α|² + |β|² = 1
 * @param {number} alpha - First amplitude
 * @param {number} beta - Second amplitude
 * @returns {Object} Normalized {alpha, beta}
 */
function normalizeAmplitudes(alpha, beta) {
    const norm = Math.sqrt(alpha * alpha + beta * beta);
    if (norm > 0) {
        return {
            alpha: alpha / norm,
            beta: beta / norm
        };
    }
    return { alpha: 1, beta: 0 };
}

/**
 * Calculate Bloch sphere angles from amplitudes
 * @param {number} alpha - Amplitude for |0⟩ state
 * @param {number} alphaPhase - Phase of alpha
 * @param {number} beta - Amplitude for |1⟩ state
 * @param {number} betaPhase - Phase of beta
 * @returns {Object} {theta, phi} in radians
 */
function calculateBlochAngles(alpha, alphaPhase, beta, betaPhase) {
    const theta = 2 * Math.acos(Math.min(1, alpha));
    const phi = betaPhase - alphaPhase;
    return { theta, phi };
}

/**
 * Create a simple animation for a value change
 * @param {string} elementId - ID of element to animate
 * @param {string} className - CSS class to add temporarily
 * @param {number} duration - Duration in milliseconds
 */
function pulseElement(elementId, className = 'pulse', duration = 300) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }
}

/**
 * Format a quantum state equation
 * @param {number} alpha - Amplitude for |0⟩
 * @param {number} alphaPhase - Phase of alpha
 * @param {number} beta - Amplitude for |1⟩
 * @param {number} betaPhase - Phase of beta
 * @returns {string} Formatted state equation
 */
function formatStateEquation(alpha, alphaPhase, beta, betaPhase) {
    const alphaStr = formatComplex(alpha, alphaPhase);
    const betaStr = formatComplex(beta, betaPhase);
    return `|ψ⟩ = ${alphaStr}|0⟩ + ${betaStr}|1⟩`;
}

/**
 * Create a simple loading indicator
 * @param {string} containerId - ID of container element
 * @param {string} message - Loading message
 */
function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="loading">${message}</div>`;
    }
}

/**
 * Remove loading indicator
 * @param {string} containerId - ID of container element
 */
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loading = container.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateProbabilityBars,
        formatComplex,
        bindSlider,
        bindSliders,
        bindPresetButtons,
        updateText,
        normalizeAmplitudes,
        calculateBlochAngles,
        pulseElement,
        formatStateEquation,
        showLoading,
        hideLoading
    };
}
