import Styles from './styles.js';
import Constants from './constants.js';
import AppDebug from './appDebug.js';
import { App } from '@capacitor/app';

// Title screen
export default class TitleScene extends Phaser.Scene {
    constructor() {
		super({key:'titleScene'});
	}
    
    preload() {
        this.load.image('titleScreen', 'assets/bg/title.jpg');
        this.load.spritesheet('title', 'assets/sprites/title.png', {frameWidth: 293, frameHeight: 269});
        this.load.spritesheet('btn_d_easy', 'assets/buttons/d_easy.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_d_easy_s', 'assets/buttons/d_easy_s.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_d_medium', 'assets/buttons/d_medium.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_d_medium_s', 'assets/buttons/d_medium_s.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_d_hard', 'assets/buttons/d_hard.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_d_hard_s', 'assets/buttons/d_hard_s.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_start', 'assets/buttons/start.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_quit', 'assets/buttons/quit.png', {frameWidth: 133, frameHeight: 41});
    }

    create() {
        const scene = this;
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;

        const STR_POINTERDOWN = 'pointerdown';
        this.LOGSTR_DIFFICULTY = 'Difficulty Level: ';

        if (!scene.difficulty) {
            scene.difficulty = Constants.difficulty.EASY;
        }

        scene.bgiTitle = scene.add.image(400, 400, 'titleScreen');
        scene.sprTitle = scene.add.sprite(screenCenterX, 150, 'title');
        scene.lblDifficulty = scene.add.text(180, 280, "Piliin ang antas ng galing", Styles.defaultText).setOrigin(0.5);
        scene.btnDiffEasy = scene.add.sprite(screenCenterX, 320, 'btn_d_easy');
        scene.btnDiffMedium = scene.add.sprite(screenCenterX, 370, 'btn_d_medium');
        scene.btnDiffHard = scene.add.sprite(screenCenterX, 420, 'btn_d_hard');
        scene.btnStart = scene.add.sprite(screenCenterX, 520, 'btn_start');
        scene.btnQuit = scene.add.sprite(screenCenterX, 570, 'btn_quit');
        scene.lblDifficulty = scene.add.text(180, 695, "Copyright © 2022 CCVMMS", Styles.defaultText).setOrigin(0.5);
        scene.lblDifficulty = scene.add.text(180, 718, "All rights reserved", Styles.defaultText).setOrigin(0.5);
        
        switch (scene.difficulty ) {
            case Constants.difficulty.HARD:
                scene.btnDiffHard.setTexture('btn_d_hard_s');
                break;
            case Constants.difficulty.MEDIUM:
                scene.btnDiffMedium.setTexture('btn_d_medium_s');
                break;
            case Constants.difficulty.EASY:
            default:
                scene.btnDiffEasy.setTexture('btn_d_easy_s');
                break;
        }

        scene.bgiTitle.setScale(0.5);
        scene.sprTitle.setScale(0.7);
        AppDebug.log(scene.LOGSTR_DIFFICULTY + scene.difficulty);
        AppDebug.log('Game OK');
        scene.btnDiffEasy.setInteractive({useHandCursor: true});
        scene.btnDiffMedium.setInteractive({useHandCursor: true});
        scene.btnDiffHard.setInteractive({useHandCursor: true});
        scene.btnStart.setInteractive({useHandCursor: true});
        scene.btnQuit.setInteractive({useHandCursor: true});
        
        scene.btnStart.on(STR_POINTERDOWN, function () {
            scene.scene.start('wordCategoryScene', {
                difficulty: scene.difficulty,
            });
            scene.scene.stop('titleScene');
        });

        scene.btnQuit.on(STR_POINTERDOWN, function () {
            scene.scene.stop('titleScene');
            App.exitApp();
        });

        scene.btnDiffEasy.on(STR_POINTERDOWN, function () {
            scene.difficulty = Constants.difficulty.EASY;
            scene.setButtonStatesToDefault();
            scene.btnDiffEasy.setTexture('btn_d_easy_s');
        });

        scene.btnDiffMedium.on(STR_POINTERDOWN, function () {
            scene.difficulty = Constants.difficulty.MEDIUM;
            scene.setButtonStatesToDefault();
            scene.btnDiffMedium.setTexture('btn_d_medium_s');
        });

        scene.btnDiffHard.on(STR_POINTERDOWN, function () {
            scene.difficulty = Constants.difficulty.HARD;
            scene.setButtonStatesToDefault();
            scene.btnDiffHard.setTexture('btn_d_hard_s');
        });
    }

    setButtonStatesToDefault() {
        AppDebug.log(this.LOGSTR_DIFFICULTY + this.difficulty);
        this.btnDiffEasy.setTexture('btn_d_easy');
        this.btnDiffMedium.setTexture('btn_d_medium');
        this.btnDiffHard.setTexture('btn_d_hard');
    }
}