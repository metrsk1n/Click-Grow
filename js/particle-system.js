// Click&Grow Premium v0.0.5-alpha - Particle System

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.isInitialized = false;
        console.log('✨ ParticleSystem created');
    }
    
    init() {
        this.createContainer();
        this.isInitialized = true;
        console.log('✅ ParticleSystem initialized');
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }
    
    createParticles(type, x, y, count = 10) {
        if (!this.isInitialized) {
            this.init();
        }
        
        const particleConfig = this.getParticleConfig(type);
        
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, particleConfig);
        }
        
        console.log(`✨ Created ${count} ${type} particles at (${x}, ${y})`);
    }
    
    getParticleConfig(type) {
        const configs = {
            water: {
                emoji: ['💧', '💦', '🌊'],
                colors: ['#3b82f6', '#1e40af', '#60a5fa'],
                size: { min: 12, max: 20 },
                speed: { min: 2, max: 5 },
                life: { min: 1000, max: 2000 },
                gravity: 0.1,
                spread: 50
            },
            fertilizer: {
                emoji: ['🌿', '🍃', '🌱'],
                colors: ['#16a34a', '#15803d', '#22c55e'],
                size: { min: 10, max: 16 },
                speed: { min: 1, max: 3 },
                life: { min: 1500, max: 2500 },
                gravity: 0.05,
                spread: 40
            },
            sunlight: {
                emoji: ['☀️', '✨', '🌟'],
                colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
                size: { min: 14, max: 22 },
                speed: { min: 3, max: 6 },
                life: { min: 1200, max: 1800 },
                gravity: -0.02,
                spread: 60
            },
            levelup: {
                emoji: ['🎉', '⭐', '💫'],
                colors: ['#8b5cf6', '#a78bfa', '#c084fc'],
                size: { min: 16, max: 24 },
                speed: { min: 4, max: 8 },
                life: { min: 2000, max: 3000 },
                gravity: -0.05,
                spread: 80
            },
            achievement: {
                emoji: ['🏆', '🎖️', '👑'],
                colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
                size: { min: 18, max: 26 },
                speed: { min: 2, max: 4 },
                life: { min: 2500, max: 3500 },
                gravity: -0.03,
                spread: 70
            },
            coin: {
                emoji: ['💰', '🪙', '💎'],
                colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
                size: { min: 12, max: 18 },
                speed: { min: 1, max: 3 },
                life: { min: 1000, max: 1500 },
                gravity: 0.08,
                spread: 30
            }
        };
        
        return configs[type] || configs.water;
    }
    
    createParticle(x, y, config) {
        const particle = document.createElement('div');
        const size = Math.random() * (config.size.max - config.size.min) + config.size.min;
        const speed = Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
        const life = Math.random() * (config.life.max - config.life.min) + config.life.min;
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * config.spread;
        
        const emoji = config.emoji[Math.floor(Math.random() * config.emoji.length)];
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            color: ${color};
            pointer-events: none;
            user-select: none;
            z-index: 1001;
            transition: all 0.1s ease-out;
        `;
        
        this.container.appendChild(particle);
        
        const particleData = {
            element: particle,
            x: x + Math.cos(angle) * spread,
            y: y + Math.sin(angle) * spread,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: life,
            maxLife: life,
            gravity: config.gravity,
            config: config
        };
        
        this.particles.push(particleData);
        
        // Animate particle
        this.animateParticle(particleData);
    }
    
    animateParticle(particle) {
        const animate = () => {
            if (particle.life <= 0) {
                this.removeParticle(particle);
                return;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            
            // Update life
            particle.life -= 16; // 60fps
            
            // Update element
            const opacity = particle.life / particle.maxLife;
            const scale = 0.5 + (opacity * 0.5);
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${scale})`;
            particle.element.style.opacity = opacity;
            
            // Continue animation
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
    
    removeParticle(particle) {
        if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
        }
        
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }
    
    clearAllParticles() {
        this.particles.forEach(particle => {
            this.removeParticle(particle);
        });
        this.particles = [];
    }
    
    // Special effects
    createExplosion(x, y, type = 'levelup') {
        this.createParticles(type, x, y, 20);
    }
    
    createTrail(x, y, type = 'water') {
        this.createParticles(type, x, y, 3);
    }
    
    createRainbowEffect(x, y) {
        const types = ['water', 'sunlight', 'fertilizer'];
        types.forEach((type, index) => {
            setTimeout(() => {
                this.createParticles(type, x, y, 5);
            }, index * 100);
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ParticleSystem = ParticleSystem;
}
