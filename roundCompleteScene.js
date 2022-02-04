import AppDebug from './appDebug.js';
import Styles from './styles.js';

// When a round is complete
export default class RoundCompleteScene extends Phaser.Scene {
    constructor() {
		super({key:'roundCompleteScene'});
	}

    init(data) {
        this.wordsFound = data.wordsFound;
        this.difficulty = data.difficulty;
        this.category = data.category;
        this.round = data.round;
    }
    
    preload() {
        this.load.image('titleScreen', 'assets/bg/title.jpg');
        this.load.spritesheet('good', 'assets/sprites/level_good.png', { frameWidth: 250, frameHeight: 101 });
        this.load.spritesheet('great', 'assets/sprites/level_great.png', {frameWidth: 250, frameHeight: 101});
        this.load.spritesheet('best', 'assets/sprites/level_best.png', {frameWidth: 250, frameHeight: 101});
    }

    create() {
        AppDebug.log('Round Complete');
        
        let scene = this;
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
        
        let spriteLevelComplete = 'good';

        if (!scene.wordsFound) {
            scene.wordsFound = 5;
        }

        // Determine the number of words found
        const wordsFound = scene.wordsFound;

        if (wordsFound >= 10) {
            spriteLevelComplete = 'best';
        } else if (wordsFound >= 8) {
            spriteLevelComplete = 'great';
        }

        scene.bgiLevelComplete = scene.add.image(400, 400, 'titleScreen');
        scene.sprLevelComplete = scene.add.sprite(screenCenterX, 250, spriteLevelComplete);
        scene.lblWordsFound = scene.add.text(180, 350, "Mga nahanap na salita:", Styles.defaultText);
        scene.lblWordsCount = scene.add.text(180, 400, scene.wordsFound, Styles.wordCount);
        scene.bgiLevelComplete.setScale(0.5);
        scene.lblWordsFound.setOrigin(0.5);
        scene.lblWordsCount.setOrigin(0.5);
        
        // Advance to next round
        scene.round++;
        
        const tmrNextRound = scene.time.addEvent({
            delay: 5000,
            callback: function () {
                scene.scene.start('mainGameScene', {
                    difficulty: scene.difficulty,
                    category: scene.category,
                    round: scene.round,
                });
                scene.scene.stop('roundCompleteScene');
            },
        });
    }
}