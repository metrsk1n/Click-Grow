// Click&Grow Premium v0.0.5a - Plant Renderer

class PlantRenderer {
    constructor() {
        this.currentLevel = 1;
        this.plantStages = this.initializePlantStages();
    }

    initializePlantStages() {
        const stages = {};
        
        // Levels 1-20: Seedling stages
        for (let i = 1; i <= 20; i++) {
            const size = 2 + (i * 0.1);
            stages[i] = {
                emoji: i <= 5 ? '🌱' : i <= 10 ? '🌿' : i <= 15 ? '🪴' : '🌱',
                name: this.getSeedlingName(i),
                size: `${size}rem`,
                glow: i >= 10,
                animation: i >= 15 ? 'plant-grow' : 'none'
            };
        }
        
        // Levels 21-50: Young trees
        for (let i = 21; i <= 50; i++) {
            const size = 4 + (i - 20) * 0.1;
            stages[i] = {
                emoji: '🌳',
                name: this.getYoungTreeName(i),
                size: `${size}rem`,
                glow: true,
                animation: 'plant-glow'
            };
        }
        
        // Levels 51-100: Mature trees
        for (let i = 51; i <= 100; i++) {
            const size = 6 + (i - 50) * 0.05;
            stages[i] = {
                emoji: i <= 75 ? '🌲' : '🌳',
                name: this.getMatureTreeName(i),
                size: `${size}rem`,
                glow: true,
                animation: 'plant-mature'
            };
        }
        
        // Levels 101-150: Magical trees
        for (let i = 101; i <= 150; i++) {
            const size = 8 + (i - 100) * 0.03;
            const emoji = this.getMagicalTreeEmoji(i);
            stages[i] = {
                emoji: emoji,
                name: this.getMagicalTreeName(i),
                size: `${size}rem`,
                glow: true,
                animation: 'plant-magical'
            };
        }
        
        // Levels 151-200: Legendary trees
        for (let i = 151; i <= 200; i++) {
            const size = 10 + (i - 150) * 0.02;
            const emoji = this.getLegendaryTreeEmoji(i);
            stages[i] = {
                emoji: emoji,
                name: this.getLegendaryTreeName(i),
                size: `${size}rem`,
                glow: true,
                animation: 'plant-legendary'
            };
        }
        
        // Levels 201-240: Divine trees
        for (let i = 201; i <= 240; i++) {
            const size = 12 + (i - 200) * 0.01;
            const emoji = this.getDivineTreeEmoji(i);
            stages[i] = {
                emoji: emoji,
                name: this.getDivineTreeName(i),
                size: `${size}rem`,
                glow: true,
                animation: 'plant-divine'
            };
        }
        
        return stages;
    }

    getSeedlingName(level) {
        const names = [
            'Tiny Seed', 'Sprouting', 'First Leaves', 'Young Sprout', 'Growing Stem',
            'Small Plant', 'Healthy Sprout', 'Strong Stem', 'Leafy Growth', 'Mature Leaves',
            'Vibrant Seedling', 'Growing Sapling', 'Fresh Growth', 'Green Sprout', 'Tender Plant',
            'Young Sapling', 'Growing Plant', 'Healthy Growth', 'Strong Sapling', 'Mature Sapling'
        ];
        return names[level - 1] || 'Young Plant';
    }

    getYoungTreeName(level) {
        const names = [
            'Young Oak', 'Growing Maple', 'Strong Pine', 'Healthy Birch', 'Mature Willow',
            'Towering Oak', 'Ancient Maple', 'Giant Pine', 'Majestic Birch', 'Grand Willow',
            'Elder Oak', 'Royal Maple', 'Sacred Pine', 'Divine Birch', 'Celestial Willow',
            'Mythical Oak', 'Legendary Maple', 'Eternal Pine', 'Immortal Birch', 'Cosmic Willow',
            'Primordial Oak', 'Universal Maple', 'Infinite Pine', 'Omnipotent Birch', 'Transcendent Willow',
            'Supreme Oak', 'Ultimate Maple', 'Perfect Pine', 'Absolute Birch', 'Ultimate Willow'
        ];
        return names[level - 21] || 'Young Tree';
    }

    getMatureTreeName(level) {
        const names = [
            'Mature Oak', 'Ancient Maple', 'Giant Pine', 'Majestic Birch', 'Grand Willow',
            'Elder Oak', 'Royal Maple', 'Sacred Pine', 'Divine Birch', 'Celestial Willow',
            'Mythical Oak', 'Legendary Maple', 'Eternal Pine', 'Immortal Birch', 'Cosmic Willow',
            'Primordial Oak', 'Universal Maple', 'Infinite Pine', 'Omnipotent Birch', 'Transcendent Willow',
            'Supreme Oak', 'Ultimate Maple', 'Perfect Pine', 'Absolute Birch', 'Ultimate Willow'
        ];
        return names[level - 51] || 'Mature Tree';
    }

    getMagicalTreeName(level) {
        const names = [
            'Cherry Blossom', 'Golden Oak', 'Silver Maple', 'Crystal Pine', 'Rainbow Birch',
            'Starlight Willow', 'Moonlight Oak', 'Sunlight Maple', 'Thunder Pine', 'Lightning Birch',
            'Storm Willow', 'Wind Oak', 'Fire Maple', 'Water Pine', 'Earth Birch',
            'Nature Willow', 'Life Oak', 'Death Maple', 'Time Pine', 'Space Birch',
            'Reality Willow', 'Dream Oak', 'Nightmare Maple', 'Hope Pine', 'Despair Birch',
            'Love Willow', 'Hate Oak', 'Peace Maple', 'War Pine', 'Order Birch',
            'Chaos Willow', 'Light Oak', 'Dark Maple', 'Good Pine', 'Evil Birch',
            'Balance Willow', 'Harmony Oak', 'Discord Maple', 'Unity Pine', 'Division Birch',
            'Creation Willow', 'Destruction Oak', 'Birth Maple', 'Death Pine', 'Rebirth Birch',
            'Eternity Willow', 'Infinity Oak', 'Void Maple', 'Existence Pine', 'Nothingness Birch'
        ];
        return names[level - 101] || 'Magical Tree';
    }

    getLegendaryTreeName(level) {
        const names = [
            'World Tree', 'Tree of Life', 'Tree of Knowledge', 'Tree of Wisdom', 'Tree of Power',
            'Tree of Time', 'Tree of Space', 'Tree of Reality', 'Tree of Dreams', 'Tree of Nightmares',
            'Tree of Creation', 'Tree of Destruction', 'Tree of Birth', 'Tree of Death', 'Tree of Rebirth',
            'Tree of Eternity', 'Tree of Infinity', 'Tree of Void', 'Tree of Existence', 'Tree of Nothingness',
            'Tree of Light', 'Tree of Darkness', 'Tree of Good', 'Tree of Evil', 'Tree of Balance',
            'Tree of Harmony', 'Tree of Discord', 'Tree of Unity', 'Tree of Division', 'Tree of Peace',
            'Tree of War', 'Tree of Order', 'Tree of Chaos', 'Tree of Love', 'Tree of Hate',
            'Tree of Hope', 'Tree of Despair', 'Tree of Joy', 'Tree of Sorrow', 'Tree of Laughter',
            'Tree of Tears', 'Tree of Smiles', 'Tree of Frowns', 'Tree of Hearts', 'Tree of Souls',
            'Tree of Minds', 'Tree of Bodies', 'Tree of Spirits', 'Tree of Essence', 'Tree of Being',
            'Tree of Becoming', 'Tree of Transformation', 'Tree of Evolution', 'Tree of Ascension', 'Tree of Transcendence'
        ];
        return names[level - 151] || 'Legendary Tree';
    }

    getDivineTreeName(level) {
        const names = [
            'Divine Tree', 'Celestial Tree', 'Heavenly Tree', 'Sacred Tree', 'Holy Tree',
            'Blessed Tree', 'Anointed Tree', 'Consecrated Tree', 'Sanctified Tree', 'Hallowed Tree',
            'Revered Tree', 'Venerated Tree', 'Worshipped Tree', 'Adored Tree', 'Cherished Tree',
            'Beloved Tree', 'Precious Tree', 'Treasured Tree', 'Valued Tree', 'Esteemed Tree',
            'Honored Tree', 'Respected Tree', 'Admired Tree', 'Praised Tree', 'Glorified Tree',
            'Exalted Tree', 'Magnified Tree', 'Amplified Tree', 'Enhanced Tree', 'Elevated Tree',
            'Uplifted Tree', 'Raised Tree', 'Lifted Tree', 'Boosted Tree', 'Empowered Tree',
            'Strengthened Tree', 'Fortified Tree', 'Reinforced Tree', 'Protected Tree', 'Guarded Tree',
            'Shielded Tree', 'Defended Tree', 'Secured Tree', 'Safeguarded Tree', 'Preserved Tree',
            'Conserved Tree', 'Maintained Tree', 'Sustained Tree', 'Supported Tree', 'Nurtured Tree'
        ];
        return names[level - 201] || 'Divine Tree';
    }

    getMagicalTreeEmoji(level) {
        const emojis = ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌿', '🍀', '🌱', '🌲'];
        return emojis[level % emojis.length];
    }

    getLegendaryTreeEmoji(level) {
        const emojis = ['🎋', '🌴', '🌲', '🌳', '🎄', '🌵', '🌾', '🌿', '🍃', '🌱'];
        return emojis[level % emojis.length];
    }

    getDivineTreeEmoji(level) {
        const emojis = ['✨', '🌟', '⭐', '💫', '🌙', '☀️', '🌈', '🔥', '💧', '🌍'];
        return emojis[level % emojis.length];
    }

    renderPlant(level, container) {
        const stage = this.plantStages[level] || this.plantStages[240];
        const animationClass = stage.animation !== 'none' ? stage.animation : '';
        const glowClass = stage.glow ? 'plant-glow' : '';
        
        container.innerHTML = `
            <div class="plant-container ${glowClass} ${animationClass}" style="font-size: ${stage.size};">
                <div class="plant-emoji">${stage.emoji}</div>
                <div class="plant-name">${stage.name}</div>
                <div class="plant-level">Level ${level}</div>
                ${this.getPlantEffects(level)}
            </div>
        `;
    }

    getPlantEffects(level) {
        if (level >= 200) {
            return '<div class="plant-effects divine">✨ Divine Aura ✨</div>';
        } else if (level >= 150) {
            return '<div class="plant-effects legendary">🌟 Legendary Power 🌟</div>';
        } else if (level >= 100) {
            return '<div class="plant-effects magical">💫 Magical Essence 💫</div>';
        } else if (level >= 50) {
            return '<div class="plant-effects mature">🌿 Mature Growth 🌿</div>';
        }
        return '';
    }

    renderDeadPlant(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="plant dead" aria-label="dead-plant">
                <div class="dead-plant-emoji">🥀</div>
                <div class="dead-plant-label" data-i18n="plant.dead">Your sprout has died</div>
                <div class="dead-plant-sub" data-i18n="plant.dead_hint">Open the app more often to keep it alive. Tap Restart to begin anew.</div>
            </div>
        `;
        container.classList.add('dead-state');
    }

    updatePlantVisual(level) {
        const plantContainer = document.querySelector('.plant-visual');
        if (!plantContainer) return;
        // If dead, render dead visual
        const engine = window.gameEngine;
        if (engine && engine.gameState && engine.gameState.dead) {
            this.renderDeadPlant(plantContainer);
            return;
        }
        this.renderPlant(level, plantContainer);
        console.log(`Plant visual updated to level ${level}`);
    }

    getPlantInfo(level) {
        return this.plantStages[level] || this.plantStages[240];
    }

    getRequiredExpForLevel(level) {
        // Progressive difficulty: each level requires more XP
        if (level <= 10) return level * 100;
        if (level <= 25) return level * 150;
        if (level <= 50) return level * 200;
        if (level <= 100) return level * 300;
        if (level <= 150) return level * 400;
        if (level <= 200) return level * 500;
        return level * 600; // Levels 201-240
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PlantRenderer = PlantRenderer;
}
