/**
 * Reusable Bloch Sphere Visualization Component
 * Uses Three.js to render an interactive 3D Bloch sphere
 */

class BlochSphere {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphere = null;
        this.stateVector = null;
        this.animationId = null;
        
        this.initialize();
    }
    
    initialize() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Create Bloch sphere (wireframe)
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
        
        // Create axes
        const axesHelper = new THREE.AxesHelper(1.5);
        this.scene.add(axesHelper);
        
        // Create state vector
        this.createStateVector();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation loop
        this.animate();
    }
    
    createStateVector() {
        const vectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const vectorMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            emissive: 0xff6b6b,
            emissiveIntensity: 0.5
        });
        this.stateVector = new THREE.Mesh(vectorGeometry, vectorMaterial);
        this.scene.add(this.stateVector);
        
        // Add arrow head
        const coneGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            emissive: 0xff6b6b,
            emissiveIntensity: 0.5
        });
        const arrowHead = new THREE.Mesh(coneGeometry, coneMaterial);
        arrowHead.position.y = 0.6;
        this.stateVector.add(arrowHead);
    }
    
    /**
     * Update the state vector position on the Bloch sphere
     * @param {number} theta - Polar angle (0 to π)
     * @param {number} phi - Azimuthal angle (0 to 2π)
     */
    updateState(theta, phi) {
        if (!this.stateVector) return;
        
        // Convert spherical to Cartesian coordinates
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(theta);
        
        // Position the vector
        this.stateVector.position.set(x * 0.5, z * 0.5, y * 0.5);
        
        // Rotate the vector to point from origin
        const direction = new THREE.Vector3(x, z, y).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
        this.stateVector.setRotationFromQuaternion(quaternion);
    }
    
    /**
     * Update state using Cartesian coordinates directly
     * @param {number} x - X coordinate (-1 to 1)
     * @param {number} y - Y coordinate (-1 to 1)
     * @param {number} z - Z coordinate (-1 to 1)
     */
    updateStateCartesian(x, y, z) {
        if (!this.stateVector) return;
        
        // Normalize the vector
        const length = Math.sqrt(x*x + y*y + z*z);
        if (length > 0) {
            x /= length;
            y /= length;
            z /= length;
        }
        
        // Position the vector
        this.stateVector.position.set(x * 0.5, z * 0.5, y * 0.5);
        
        // Rotate the vector to point from origin
        const direction = new THREE.Vector3(x, z, y).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
        this.stateVector.setRotationFromQuaternion(quaternion);
    }
    
    handleResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Slowly rotate the Bloch sphere for better visualization
        if (this.sphere) {
            this.sphere.rotation.y += 0.002;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        // Dispose geometries and materials
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlochSphere;
}
