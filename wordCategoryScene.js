import Styles from './styles.js';
import Constants from './constants.js';
import AppDebug from './appDebug.js';

// Select word category
export default class WordCategoryScene extends Phaser.Scene {
    constructor() {
		super({key:'wordCategoryScene'});
	}

    preload() {
        this.load.image('categoryScreen', 'assets/bg/category.jpg');
        this.load.spritesheet('btn_start', 'assets/buttons/start.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_return', 'assets/buttons/return.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_c_animal', 'assets/buttons/c_animal.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_c_animal_s', 'assets/buttons/c_animal_s.png', { frameWidth: 133, frameHeight: 41 });
        this.load.spritesheet('btn_c_place', 'assets/buttons/c_place.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_c_place_s', 'assets/buttons/c_place_s.png', { frameWidth: 133, frameHeight: 41 });
        this.load.spritesheet('btn_c_school', 'assets/buttons/c_school.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_c_school_s', 'assets/buttons/c_school_s.png', { frameWidth: 133, frameHeight: 41 });
        this.load.spritesheet('btn_c_misc', 'assets/buttons/c_misc.png', {frameWidth: 133, frameHeight: 41});
        this.load.spritesheet('btn_c_misc_s', 'assets/buttons/c_misc_s.png', { frameWidth: 133, frameHeight: 41 });
    }

    init(data) {
        this.difficulty = data.difficulty;
    }
    
    create() {
        const scene = this;
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
        
        const STR_POINTERDOWN = 'pointerdown';

        if (!scene.category) {
            scene.category = Constants.category.ANIMAL;
        }

        scene.bgiCategory = scene.add.image(400, 400, 'categoryScreen');
        scene.lblCategory = scene.add.text(180, 160, "Piliin ang paksa", Styles.defaultText).setOrigin(0.5);
        scene.btnCategAnimal = scene.add.sprite(screenCenterX, 200, 'btn_c_animal');
        scene.btnCategPlace = scene.add.sprite(screenCenterX, 250, 'btn_c_place');
        scene.btnCategSchool = scene.add.sprite(screenCenterX, 300, 'btn_c_school');
        scene.btnCategOther = scene.add.sprite(screenCenterX, 350, 'btn_c_misc');
        scene.btnStart = scene.add.sprite(screenCenterX, 520, 'btn_start');
        scene.btnBack = scene.add.sprite(screenCenterX, 570, 'btn_return');

        switch (scene.category) {
            case Constants.category.OTHER_STUFF:
                scene.btnCategOther.setTexture('btn_c_misc_s');
                break;
            case Constants.category.SCHOOL_STUFF:
                scene.btnCategSchool.setTexture('btn_c_school_s');
                break;
            case Constants.category.PLACE:
                scene.btnCategPlace.setTexture('btn_c_place_s');
                break;
            case Constants.category.ANIMAL:
            default:
                scene.btnCategAnimal.setTexture('btn_c_animal_s');
                break;
        }

        scene.bgiCategory.setScale(0.5);
        scene.btnCategAnimal.setInteractive({useHandCursor: true});
        scene.btnCategPlace.setInteractive({useHandCursor: true});
        scene.btnCategSchool.setInteractive({useHandCursor: true});
        scene.btnCategOther.setInteractive({useHandCursor: true});
        scene.btnStart.setInteractive({useHandCursor: true});
        scene.btnBack.setInteractive({useHandCursor: true});

        scene.btnCategAnimal.on(STR_POINTERDOWN, function () {
            scene.category = Constants.category.ANIMAL;
            scene.setButtonStatesToDefault();
            scene.btnCategAnimal.setTexture('btn_c_animal_s');
        });

        scene.btnCategPlace.on(STR_POINTERDOWN, function () {
            scene.category = Constants.category.PLACE;
            scene.setButtonStatesToDefault();
            scene.btnCategPlace.setTexture('btn_c_place_s');
        });

        scene.btnCategSchool.on(STR_POINTERDOWN, function () {
            scene.category = Constants.category.SCHOOL_STUFF;
            scene.setButtonStatesToDefault();
            scene.btnCategSchool.setTexture('btn_c_school_s');
        });

        scene.btnCategOther.on(STR_POINTERDOWN, function () {
            scene.category =  Constants.category.OTHER_STUFF;
            scene.setButtonStatesToDefault();
            scene.btnCategOther.setTexture('btn_c_misc_s');
        });

        scene.btnStart.on(STR_POINTERDOWN, function () {
            scene.scene.start('mainGameScene', {
                difficulty: scene.difficulty,
                category: scene.category,
            });
            scene.scene.stop('wordCategoryScene');
        });

        scene.btnBack.on(STR_POINTERDOWN, function () {
            scene.scene.start('titleScene');
            scene.scene.stop('wordCategoryScene');
        });
    }

    setButtonStatesToDefault() {
        const LOGSTR_CATEGORY = 'Selected Category: ';
        AppDebug.log(LOGSTR_CATEGORY + this.category);
        this.btnCategAnimal.setTexture('btn_c_animal');
        this.btnCategPlace.setTexture('btn_c_place');
        this.btnCategSchool.setTexture('btn_c_school');
        this.btnCategOther.setTexture('btn_c_misc');
    }
}