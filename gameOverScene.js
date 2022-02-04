import Styles from './styles.js';
import AppDebug from './appDebug.js';

// Game Over: Return to title screen
export default class GameOverScene extends Phaser.Scene {
    constructor() {
		super({key:'gameOverScene'});
    }
    
    init(data) {
        this.wordsFound = data.wordsFound;
        this.difficulty = data.difficulty;
        this.category = data.category;
        this.round = data.round;
    }
    
    preload() {
        this.load.image('titleScreen', 'assets/bg/title.jpg');
        this.load.spritesheet('game_over', 'assets/sprites/game_over.png', { frameWidth: 250, frameHeight: 101 });
        this.load.spritesheet('btn_continue', 'assets/buttons/continue.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_restart', 'assets/buttons/restart.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_quit', 'assets/buttons/quit.png', {frameWidth: 133, frameHeight: 41});
    }

    create() {
        AppDebug.log('Game Over');
        
        const scene = this;
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;

        const STR_POINTERDOWN = 'pointerdown';
        const SCENE_GAME_OVER = 'gameOverScene';

        if (!scene.wordsFound) {
            scene.wordsFound = 0;
        }

        scene.bgiGameOver = scene.add.image(400, 400, 'titleScreen');
        scene.sprGameOver = scene.add.sprite(screenCenterX, 250, 'game_over');
        scene.lblWordsFound = scene.add.text(180, 350, "Mga nahanap na salita:", Styles.defaultText);
        scene.lblWordsCount = scene.add.text(180, 400, scene.wordsFound, Styles.wordCount);
        scene.bgiGameOver.setScale(0.5);
        scene.lblWordsFound.setOrigin(0.5);
        scene.lblWordsCount.setOrigin(0.5);
        scene.btnContinue = scene.add.sprite(screenCenterX, 450, 'btn_continue');
        scene.btnRestart = scene.add.sprite(screenCenterX, 500, 'btn_restart');
        scene.btnQuit = scene.add.sprite(screenCenterX, 550, 'btn_quit');

        // Go back to previous round or round 1
        scene.round--;
        if (scene.round < 1) {
            scene.round = 1;
        }

        scene.btnContinue.setInteractive({useHandCursor: true});
        scene.btnRestart.setInteractive({useHandCursor: true});
        scene.btnQuit.setInteractive({useHandCursor: true});

        scene.btnContinue.on(STR_POINTERDOWN, function () {
            scene.scene.start('mainGameScene', {
                difficulty: scene.difficulty,
                category: scene.category,
                round: scene.round,
            });
            scene.scene.stop(SCENE_GAME_OVER);
        });
        
        scene.btnRestart.on(STR_POINTERDOWN, function () {
            scene.scene.start('wordCategoryScene', {
                difficulty: scene.difficulty,
            });
            scene.scene.stop(SCENE_GAME_OVER);
        });

        scene.btnQuit.on(STR_POINTERDOWN, function () {
            scene.scene.start('titleScene');
            scene.scene.stop(SCENE_GAME_OVER);
        });
        
        const tmrReturnToTitle = scene.time.addEvent({
            delay: 10000,
            callback: function () {
                scene.scene.start('titleScene');
                scene.scene.stop(SCENE_GAME_OVER);
            },
        });
    }
}