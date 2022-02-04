import Wordsearch from 'wordsearch-generator';

import Constants from './constants.js';
import Styles from './styles.js';
import AppDebug from './appDebug.js';
import Utils from './utils.js';

// Main game stuff
export default class MainGameScene extends Phaser.Scene {
    constructor() {
		super({key:'mainGameScene'});
	}

    init(data) {
        this.difficulty = data.difficulty;
        this.category = data.category;
        this.round = data.round;
    }

    preload() {
        this.load.image('roundScreen', 'assets/bg/round.jpg');
        this.load.spritesheet('btn_return', 'assets/buttons/return.png', {frameWidth: 133, frameHeight: 41});
    }

    create() {
        const scene = this;
        const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;

        const LOGSTR_DIFFICULTY = 'Difficulty Level: ';
        const LOGSTR_CATEGORY = 'Word Category: ';
        const LOGSTR_ROUND = 'Round: ';
        const LOGSTR_TIME = 'Time: ';
        
        if (!scene.round) {
            scene.round = 1;
        }

        scene.tileWidth = Constants.defaults.TILE_WIDTH;
        scene.tileHeight = Constants.defaults.TILE_HEIGHT;
        scene.initialTime = this.setRoundTime(scene.round);
        scene.tileGroup = scene.add.group();
        scene.selectedTiles = [];
        scene.completedTiles = [];
        scene.wordLabels = [];
        scene.wordLabelsFull = [];
        scene.wordsList = [];
        scene.wordsFound = [];
        scene.startTile = null;
        scene.lastTile = null;
        scene.curDirection = null;
        scene.curWord = '';

        AppDebug.log('Round OK');
        AppDebug.log(LOGSTR_DIFFICULTY + scene.difficulty);
        AppDebug.log(LOGSTR_CATEGORY + scene.category);
        AppDebug.log(LOGSTR_ROUND + scene.round);
        AppDebug.log(LOGSTR_TIME + scene.initialTime);

        scene.bgiRound = scene.add.image(400, 400, 'roundScreen');
        scene.lblRound = scene.add.text(180, 14, "Round: " + scene.round, Styles.scoreText).setOrigin(0.5);
        scene.lblTime = scene.add.text(180, 40, "Time: " + scene.formatTime(scene.initialTime), Styles.scoreText).setOrigin(0.5);
        scene.btnBack = scene.add.sprite(screenCenterX, 650, 'btn_return');

        scene.lblRound.setStroke('#aaa', 1);
        scene.lblTime.setStroke('#aaa', 1);
        scene.bgiRound.setScale(0.5);
        scene.btnBack.setInteractive({useHandCursor: true});
        
        // Generate the word list
        scene.getWordsList();

        // Generate the playfield
        scene.generatePlayfield();
        
        // Generate the word labels
        scene.generateWordLabels();

        scene.tmrCountdown = scene.time.addEvent({
            delay: 1000,
            callback: function () {
                scene.initialTime--;
                scene.lblTime.setText("Time: " + scene.formatTime(scene.initialTime));
                if (scene.initialTime < 1) {
                    AppDebug.log('Time Up');
                    scene.finishRound();
                }
            },
            loop: true,
        });

        scene.btnBack.on('pointerdown', function () {
            scene.scene.start('wordCategoryScene');
            scene.scene.stop('mainGameScene');
        });
    }

    getWordsList() {
        const scene = this;
        const difficulty = scene.difficulty;
        const category = scene.category;
        
        let words = [];
        const wordsToFind = [];

        scene.wordLabels = [];
        
        if (difficulty === Constants.difficulty.EASY) {
            if (category === Constants.category.ANIMAL) {
                words = [
                    'OSO (bear)',
                    'SUSO (snail)',
                    'USA (deer)',
                    'KAMBING (goat)',
                    'KUNEHO (rabbit)',
                    'DAGA (rat)',
                    'LEON (lion)',
                    'PABO (turkey)',
                    'TUPA (sheep)',
                    'PATO (duck)',
                    'PUGITA (octopus)',
                    'BABOY (pig)',
                    'AHAS (snake)',
                    'ASO (dog)',
                    'PARUPARO (butterfly)',
                    'UNGGOY (monkey)',
                    'MANOK (chicken)',
                    'PAGONG (turtle)',
                    'PALAKA (frog)',
                    'KALABAW (buffalo)',
                ];
            } else if (category === Constants.category.PLACE) {
                words = [
                    'BARYO (village)',
                    'BUNDOK (mountain)',
                    'BUKID (farm)',
                    'OSPITAL (hospital)',
                    'ILOG (river)',
                    'LAWA (lake)',
                    'BUROL (hill)',
                    'BAHAY (house)',
                    'TALON (waterfall)',
                    'PAARALAN (school)',
                    'KUSINA (kitchen)',
                    'LAMBAK (valley)',
                    'KALYE (street)',
                    'KUSINA (kitchen)',
                    'LAWA (lake)',
                    'OSPITAL (hospital)',
                    'PAARALAN (school)',
                    'PALENGKE (market)',
                    'PASYALAN (parke)',
                    'PLAZA (park)',
                    'SALA (living room)',
                    'SIMBAHAN (church)',
                    'TAHANAN (home)',
                    'TALON (waterfalls)',
                ];
            } else if (category === Constants.category.SCHOOL_STUFF) {
                words = [
                    'LAPIS (pencil)',
                    'PAPEL (paper)',
                    'PAMBURA (eraser)',
                    'PANTASA (sharpener)',
                    'KRAYOLA (crayon)',
                    'PISARA (chalkboard)',
                    'LAMESA (desk)',
                    'BANGKO (chair)',
                    'LIBRO (book)',
                    'ORASAN (clock)',
                    'AGHAM (science)',
                    'WIKA (language)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                    'UNIPORME (uniform)',
                ];
            } else if (category === Constants.category.OTHER_STUFF) {
                words = [
                    'UNAN (pillow)',
                    'LABABO (sink)',
                    'LAMESA (table)',
                    'SANDOK (ladle)',
                    'MANGKOK (bowl)',
                    'PLATO (plate)',
                    'TUWALYA (towel)',
                    'SUKLAY (comb)',
                    'BASAHAN (rag)',
                    'KUMOT (blanket)',
                    'KOTSE (car)', 
                    'TUHOD (knee)',
                    'BALIKAT (shoulder)',
                    'BINTI (leg)',
                    'BIBIG (mouth)',
                    'KAMAY (hand)', 
                    'TASA (mug)',
                    'BUHOK (hair)',
                    'ILAW (light)',
                    'BUWAN (moon)',
                    'NGIPIN (tooth)',
                    'PANGIL (fang)',
                    
                ];
            }
        } else if (difficulty === Constants.difficulty.MEDIUM) {
            if (category === Constants.category.ANIMAL) {
                words = [
                    'KAMELYO (camel)',
                    'KALABAW (buffalo)',
                    'KAMBING (goat)',
                    'SALAGINTO (beetle)',
                    'ANITO (termite)',
                    'IGAT (eel)',
                    'UWAK (crow)',
                    'BIBI (duckling)',
                    'KALAPATI (dove)',
                    'PANIKI (bat)',
                    'GAGAMBA (spider)',
                    'UNGGOY (monkey)',
                    'KABAYO (horse)',
                    'DILIS (anchovy)',
                    'KUNEHO (rabbit)',
                    'BUBUYOG (bee)',
                    'AGILA (eagle)',
                    'PATO (duck)',
                    'USA (deer)',
                    'BUTIKI (lizard)',
                ];
            } else if (category === Constants.category.PLACE) {
                words = [
                    'OPISINA (office)',
                    'BAKURAN (yard)',
                    'BAYBAYIN (coast)',
                    'HARDIN (garden)',
                    'KAPILYA (chapel)',
                    'PALAYAN (rice field)',
                    'DAGAT (sea)',
                    'PALENGKE (market)',
                    'TINDAHAN (store)',
                    'BODEGA (warehouse)',
                    'LIBINGAN (cemetery)',
                    'BAKURAN (yard)',
                    'KANTINA (canteen)',
                    'PALAISDAAN (fishery)',
                    'RESTAWRAN (restaurant)',
                    'SEMENTERYO (cemetery)',
                    'KUWARTO (bedroom)',
                    'KWEBA (cave)',
                    'KUWARTO (bedroom)',
                    'DALAMPASIGAN (beach)',
                    'PALIGUAN (bathroom)',
                    'INTRAMUROS (walled city)',
                ];
            } else if (category === Constants.category.SCHOOL_STUFF) {
                words = [
                    'KALENDARYO (calendar)',
                    'MAPA (map)',
                    'WATAWAT (flag)',
                    'GLOBO (globe)',
                    'GUNTING (scissors)',
                    'PANDIKIT (glue)',
                    'PINTO (door)',
                    'BINTANA (window)',
                    'BOLPEN (ballpen)',
                    'SAPATOS (shoe)',
                    'SINING (art)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                    'GURO (teacher)',
                ];
            } else if (category === Constants.category.OTHER_STUFF) {
                words = [
                    'KUTSON (mattress)',
                    'TAKURE (kettle)',
                    'KAHOY (wood)',
                    'TABO (dipper)',
                    'LUBID (rope)',
                    'KALAN (stove)',
                    'BASO (tumble)',
                    'APARADOR (cabinet)',
                    'KAMATIS (tomato)',
                    'SALAMIN (mirror)',
                    'TALONG (eggplant)',
                    'DALIRI (finger)',
                    'APOY (fire)',
                    'TUBIG (water)',
                    'BUTIL (seed)',
                    'TINIK (thorn)',
                    'BUTO (bone)',
                    'KALANSAY (skeleton)',
                    'MANSANAS (apple)',
                    'KAHEL (orange)',
                    'REPOLYO (cabbage)',
                    'PATATAS (potato)',
                ];
            }
        } else if (difficulty === Constants.difficulty.HARD) {
            if (category === Constants.category.ANIMAL) {
                words = [
                    'ALIMASAG (crab)',
                    'BALYENA (whale)',
                    'DIKYA (jellyfish)',
                    'PAGI (stingray)',
                    'PARUPARO (butterfly)',
                    'TUTUBI (dragonfly)',
                    'ALITAPTAP (firefly)',
                    'TIPAKLONG (grasshopper)',
                    'PUTAKTI (wasp)',
                    'ALUPIHAN (centipede)',
                    'GAMUGAMO (moth)',
                    'LANGGAM (ant)',
                    'PUSIT (squid)',
                    'ELEPANTE (elephant)',
                    'TUPA (sheep)',
                    'PIPIT (sparrow)',
                    'KAMELYO (camel)',
                    'SUROT (flea)',
                    'HUNYANGO (chameleon)',
                    'LAWIN (hawk)',
                ];
            } else if (category === Constants.category.PLACE) {
                words = [
                    'HUKUMAN (courtroom)',
                    'DAUNGAN (seaport)',
                    'PALIPARAN (airport)',
                    'BOTIKA (pharmacy)',
                    'SINEHAN (cinema)',
                    'MUSEO (museum)',
                    'PALIKURAN (restroom)',
                    'PIITAN (jail)',
                    'BANGIN (cliff)',
                    'BARBERYA (barber)',
                    'AKLATAN (library)',
                    'KASTILYO (castle)',
                    'BALKONAHE (balcony)',
                    'DEPARTAMENTO (department)',
                    'DURONGAWAN (window)',
                    'GULAYAN (vegetable patch)',
                    'HIMLAYAN (bedroom)',
                    'MUNISIPYO (municipality)',
                    'PAMAYANAN (community)',
                    'PAARALAN (school)',
                    'PAMILIHAN (market)',
                    'TINDAHAN (store)',
                     
                ];
            } else if (category === Constants.category.SCHOOL_STUFF) {
                words = [
                    'TISA (chalk)',
                    'KUWADERNO (notebook)',
                    'KABALYAS (bag)',
                    'BENTILADOR (electric fan)',
                    'PANUKAT (ruler)',
                    'ESTANTE (bookshelf)',
                    'UNIPORME (uniform)',
                    'PAMAYPAY (hand fan)',
                    'PANYO (handkerchief)',
                    'LENTE (lens)',
                    'GAMOT (medicine)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                    'TINAPAY (bread)',
                ];
            } else if (category === Constants.category.OTHER_STUFF) {
                words = [
                    'DULANG (table)',
                    'TAPAYAN (bucket)',
                    'ABANIKO (hand fan)',
                    'KALASAG (shield)',
                    'DUYAN (cradle)',
                    'BUSLO (basket)',
                    'GITARA (guitar)',
                    'SAGING (banana)',
                    'PILAK (silver)',
                    'GINTO (gold)',
                    'TOKWA (tofu)',
                    'MANGGA (mango)',
                    'PULA (red)',
                    'BUGHAW (blue)',
                    'DILAW (yellow)', 
                    'LUNTIAN (green)',
                    'ITIM (black)',  
                    'PUTI (white)',
                    'ABO (ash)',
                    'BITUIN (star)',
                    'BULALAKAW (meteor)',
                    'KAMPANA (bell)',
                    'MARTILYO (hammer)',
                ];
            }
        }

        for (let i = 0; i < Constants.defaults.MAX_WORDS; i++) {
            const lastId = (words.length - 1);
            let word;
            if (scene.round > 2) {
                // Round 3 onwards: Random word selection
                let randId = Phaser.Math.Between(0, lastId);
                word = words[randId];
            } else if (scene.round == 2) {
                // Round 2: Fixed word selection (11 to 20)
                word = words[i + 10];
            } else {
                // Round 1: Fixed word selection (1 to 10)
                word = words[i];
            }
            
            let wordToFind = word.split(" ")[0];
            let isWordInList = wordsToFind.includes(wordToFind);
        
            // No two words must be the same in the list
            while (isWordInList) {
                let randId = Phaser.Math.Between(0, lastId);
                word = words[randId];
                wordToFind = word.split(" ")[0];
                isWordInList = wordsToFind.includes(wordToFind);
                if (!isWordInList) {
                    break;
                }
            }

            scene.wordLabelsFull.push(word);
            wordsToFind.push(wordToFind.toUpperCase());
            scene.wordsList = wordsToFind;
        }
    }

    generatePlayfield() {
        const board = this;
        const LANG_EN = 'en';
        const LENGTH_TILES = Constants.defaults.TILE_CELLS;
        
        board.tileGrid = Utils.NArray(LENGTH_TILES, LENGTH_TILES);
        board.boardWidth = board.tileGrid[0].length * board.tileWidth;
        board.boardHeight = board.tileGrid.length * board.tileHeight;

        board.puzzleLetters = [];

        // Generate the internal puzzle grid first
        let puzzleGrid = Wordsearch.createPuzzle(LENGTH_TILES, LENGTH_TILES, LANG_EN, board.wordsList);
        puzzleGrid = Wordsearch.hideWords(puzzleGrid, LANG_EN);
        let puzzleGridLines = Wordsearch.printGrid(puzzleGrid);
        for (let i = 0; i < puzzleGridLines.length; i++) {
            board.puzzleLetters.push(puzzleGridLines[i].split(' '));
        }
        
        board.initTiles();
    }

    initTiles() {
        const board = this;
        let coordX = 0;
        let coordY = 60;
        for (let x = 0; x < board.tileGrid.length; x++) {
            coordX = 10;
            for (let y = 0; y < board.tileGrid.length; y++) {
                const tile = board.addTile(x, y, coordX, coordY);
                board.tileGrid[x][y] = tile;
                coordX += 28;
            }
            coordY += 29;
        }
    }

    addTile(x, y, coordX, coordY) {
        const board = this;
        const tileLetter = board.puzzleLetters[x][y];
        const tile = board.add.text(coordX, coordY, tileLetter, Styles.tile);
        const LAST_TILE = (Constants.defaults.TILE_CELLS - 1);
        tile.setInteractive({useHandCursor: true});
        tile.setData('letter', tileLetter);
        tile.setData('posX', x);
        tile.setData('posY', y);

        if (x == 0 || x == LAST_TILE || y == 0 || y == LAST_TILE) {
            tile.setData('isBorderTile', true);
        } else {
            tile.setData('isBorderTile', false);
        }

        board.tileGroup.add(tile);

        tile.on('pointerdown', function () {
            if (!board.completedTiles.includes(this)) {
                this.setStyle(Styles.selectedTile);
            }
            this.setData('selected', true);
            board.startTile = this;
            board.selectedTiles.push(this);
            board.curWord = this.getData('letter');
        });
        tile.on('pointermove', function () {
            board.selectTile(this);
        });
        tile.on('pointerup', function () {
            board.endTurn();
        });

        return tile;
    }

    selectTile(target) {
        const board = this;

        if (!board.startTile) {
            return;
        }
        
        board.lastTile = board.selectedTiles[board.selectedTiles.length - 1];
        if (board.lastTile == target) {
            return;
        }

        var backTo;
        for (var i = 0, len = board.selectedTiles.length; i < len; i++) {
            if (board.selectedTiles[i] == target) {
                backTo = i + 1;
                break;
            }
        }

        while (backTo < board.selectedTiles.length) {
            let tile = board.selectedTiles[board.selectedTiles.length - 1];
            if (!board.completedTiles.includes(tile)) {
                tile.setStyle(Styles.tile);
            }
            board.selectedTiles.splice(backTo, 1);
            board.curWord = board.curWord.substr(0, board.curWord.length - 1);
        }

        var newDirection = board.computeDirection(
            board.startTile.getData('posX') - 0,
            board.startTile.getData('posY') - 0,
            target.getData('posX') - 0,
            target.getData('posY') - 0,
        );

        if (newDirection) {
            board.selectedTiles = [board.startTile];
            board.curWord = board.startTile.getData('letter');
            if (board.lastTile !== board.startTile && !board.completedTiles.includes(board.lastTile)) {
                board.lastTile.setStyle(Styles.tile);
                board.lastTile = board.startTile;
            }
            board.curDirection = newDirection;
        }

        var direction = board.computeDirection(
            board.lastTile.getData('posX') - 0,
            board.lastTile.getData('posY') - 0,
            target.getData('posX') - 0,
            target.getData('posY') - 0,
        );
        
        if (!direction) {
            return;
        }

        if (target.getData('isBorderTile') == true) {
            target.on('pointerout', function (pointer) {
                const worldX = pointer.worldX;
                const worldY = pointer.worldY;
                if (worldX < 10 || worldX >= 346 || worldY < 60 || worldY > 408) {
                    AppDebug.log('Out of bounds, ending turn.');
                    board.endTurn();
                }
            });
        }

        if (!board.curDirection || board.curDirection === direction) {
            board.curDirection = direction;
            board.playTurn(target);
        }
    }

    playTurn(tile) {
        const board = this;

        for (var i = 0, len = board.wordsList.length; i < len; i++) {
            var letter = tile.getData('letter');
            if (!board.completedTiles.includes(tile)) {
                tile.setStyle(Styles.selectedTile);
            }
            tile.setData('selected', true);
            board.selectedTiles.push(tile);
            board.curWord += letter;
            break;
        }
    }

    endTurn() {
        const board = this;
        let wordIsFound = false;

        for (var x = 0; x < board.tileGrid.length; x++) {
            for (var y = 0; y < board.tileGrid[x].length; y++) {
                var selectedTile = board.tileGrid[x][y];
                if (!board.completedTiles.includes(selectedTile)) {
                    selectedTile.setStyle(Styles.tile);
                }
            }
        }

        for (var i = 0, len = board.wordsList.length; i < len; i++) {
            if (board.wordsList[i] === board.curWord) {
                wordIsFound = true;

                // Only if the word has not been found yet
                if (!board.wordsFound.includes(board.curWord)) {
                    for (var j = 0; j < board.selectedTiles.length; j++) {
                        var selectedTile = board.selectedTiles[j];
                        selectedTile.setStyle(Styles.completedTile);
                        if (!board.completedTiles.includes(selectedTile)) {
                            board.completedTiles.push(selectedTile);
                        }
                    }
                    AppDebug.log('Current word: ' + board.curWord);
                    board.wordsFound.push(board.curWord);
                
                    // We can now access the board.wordLabels variable that is created
                    // in another scene-spec method
                    for (var j = 0; j < board.wordLabels.length; j++) {
                        if (board.wordLabels[j].getData('value') == board.curWord) {
                            board.wordLabels[j].setStyle(Styles.completedLabel);
                            board.wordLabels[j].setStroke('#080', 1);
                        }
                    }

                    AppDebug.log('Found words: ' + board.wordsFound.toString());
                    board.refreshBoard();
                    
                    // Got every word
                    if (board.wordsFound.length == board.wordsList.length) {
                        board.finishRound();
                    }
                }
            }
        }

        if (!wordIsFound) {
            for (var i = 0; i < board.selectedTiles.length; i++) {
                let selectedTile = board.selectedTiles[i];
                if (!board.completedTiles.includes(selectedTile)) {
                    selectedTile.setStyle(Styles.failedTile);
                }
            }

            const tmrClearAllTiles = board.time.addEvent({
                delay: 100,
                callback: function () {
                    for (var i = 0; i < board.selectedTiles.length; i++) {
                        let selectedTile = board.selectedTiles[i];
                        if (!board.completedTiles.includes(selectedTile)) {
                            selectedTile.setStyle(Styles.tile);
                        }
                    }

                    board.refreshBoard();
                },
                callbackScope: this,
                loop: false,
            });
        }
    }

    refreshBoard() {
        const board = this;

        board.startTile = null;
        board.selectedTiles = [];
        board.curWord = '';
        board.curDirection = null;
        
        board.wordsFound.sort();
        board.wordsList.sort();
    }

    computeDirection(x1, y1, x2, y2) {
        for (var direction in Utils.directions) {
            var nextFn = Utils.directions[direction];
            var nextPos = nextFn(x1, y1, 1);

            if (nextPos.x === x2 && nextPos.y === y2) {
                return direction;
            }
        }

        return null;
    }

    generateWordLabels() {
        this.wordLabels = [];

        let coordX = 90;
        let coordY = 440;
        for (let x = 0; x < this.wordLabelsFull.length; x++) {
            let word = this.wordLabelsFull[x].split(" ")[0];
            coordX = 90;
            if (x % 2 !== 0) {
                coordX = 270;
            }
            
            // this.wordLabels is a scene variable and should be known by all scene methods
            this.wordLabels[x] = this.add.text(coordX, coordY, this.wordLabelsFull[x], Styles.wordLabel);

            this.wordLabels[x].setData('value', word);
            this.wordLabels[x].setStroke('#000', 1);
            this.wordLabels[x].setOrigin(0.5);

            if (x % 2 !== 0) {
                coordY += 30;
            }
        }
    }

    finishRound() {
        // Get the number of words found
        const scene = this;
        const wordsFound = scene.wordsFound.length;

        AppDebug.log('Round Finished');
        this.tmrCountdown.destroy();
        this.scene.stop('mainGameScene');

        if (wordsFound >= 5) {
            // Round Complete
            this.scene.start('roundCompleteScene', {
                wordsFound: wordsFound,
                difficulty: scene.difficulty,
                category: scene.category,
                round: scene.round,
            });
            
        } else {
            // Game Over
            this.scene.start('gameOverScene', {
                wordsFound: wordsFound,
                difficulty: scene.difficulty,
                category: scene.category,
                round: scene.round,
            });
        }
    }
    
    setRoundTime(round = 1) {
        const scene = this;
        const MIN_ROUND_TIME = 120;

        // 8 minutes on Easy mode
        let maxRoundTime = 480;

        if (scene.difficulty == Constants.difficulty.MEDIUM) {
            // 9 minutes on Medium mode
            maxRoundTime = 540;
        } else if (scene.difficulty == Constants.difficulty.HARD) {
            // 10 minutes on Hard mode
            maxRoundTime = 600;
        }

        let roundTime = maxRoundTime - ((round - 1) * 10);

        if (roundTime < MIN_ROUND_TIME) {
            roundTime = MIN_ROUND_TIME;
        }

        return roundTime;
    }

    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remSeconds = seconds % 60;
        remSeconds = remSeconds.toString().padStart(2, '0');
        return `${minutes}:${remSeconds}`;
    }
}
