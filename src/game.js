/* Bot Wars 
   Implemented with CreateJS
   INFT4000 Special Topics I
   Brent LeBlanc
*/

(function() {

    // Game variables
    let stage = null;
    let canvas = null;
    let leftKey = false;
    let rightKey = false;
    let spacebar = false;

    // Frame rate of game
    const FRAME_RATE = 26;

    // Max speed of asteroid
    const ASTEROID_MAX_SPEED = 5;

    const ASTEROID_START_DELAY = 500;
    const ASTEROID_MAX = 50;
    let asteroidPool = [];
    let asteroidsDestroyed = null;
    let asteroidTimer = null;

    // Game objects
    let assetManager = null;
    let introCaption = null;
    let endCaption = null;
    let score = null;
    let background = null;
    let shooter = null;
    let asteroid = null;

    // ------------------------------------------------------------ Event handlers
    function onReady(e) {
        console.log(">> setup");
        // Remove event listener
        e.remove();

        // Construct game objects
        // Might want to encapsulate all this in a UserInterface class
        background = assetManager.getSprite("spritesheet");
        background.setTransform(0, 0, 0.5, 0.5);
        background.gotoAndStop("background");
        stage.addChild(background);
        
        introCaption = assetManager.getSprite("spritesheet");
        introCaption.setTransform(140, 180, 0.5, 0.5);
        introCaption.gotoAndStop("introCaption");
        
        stage.addChild(introCaption);
        
        // endCaption = assetManager.getSprite("spritesheet");
        // endCaption.gotoAndStop("endCaption");
        // endCaption.x = 50;
        // endCaption.y = 50;
        
        shooter = new Shooter(stage, assetManager);

        for (let i=0; i<ASTEROID_MAX; i++) {
            asteroidPool.push(new Asteroid(stage, assetManager, shooter));
        }
        
        // Event listener to start game
        background.on("click", onStartGame);
        
        // ** Listen for dispatched events here ** 

        console.log(">> game ready");
        // Startup the ticker
        createjs.Ticker.framerate = FRAME_RATE;
        createjs.Ticker.on("tick", onTick);
    }

    function onStartGame(e) {
        stage.removeChild(introCaption);

        // Remove click event on background
        e.remove();

        // Start the shooter object
        shooter.setupMe();
        asteroid.setupMe();

        asteroidsDestroyed = 0;

        asteroidTimer = window.setInterval(onAddAsteroid, ASTEROID_START_DELAY);

        // Current state of keys
        leftKey = false;
        rightKey = false;
        
        // Event listeners for keyboard keys
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;
    }

    function onAddBug(e) {
        // find bug in pool and add to game
        for (let i=0; i<bugPool.length; i++) {
            let newBug = bugPool[i];
            if (newBug.active === false) {
                newBug.active = true;
                newBug.setupMe();
                newBug.releaseMe();
                break;
            }
        }
    }
    
    function onKeyDown(e) {
        // Which keystrokes are left and right?
        switch (e.keyCode) {
            case 37: 
                console.log("left arrow");
                leftKey = true;
                rightKey = false;
                //shooter.rotateCCW();
                break;
            case 39:
                console.log("right arrow");
                leftKey = false;
                rightKey = true;
                //shooter.rotateCW();
                break;
            default: console.log("some other button");
        }
    }

    function onKeyUp(e) {
        // Which keystrokes are left and right?
        switch (e.keyCode) {
            case 37: 
                leftKey = false;
                rightKey = false;
                break;
            case 39:
                leftKey = false;
                rightKey = false;
                break;
        }
    }

    function onTick(e) {
        // Testing FPS of game
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // ** Other logic here **

        if (leftKey) {
            // Might want to create a Mover class for this purpose
            shooter.rotateCCW();
        } else if (rightKey) {
            shooter.rotateCW();
        }

        stage.update();
    }

    // ------------------------------------------------------------------------- Entry point of game
    function main() {
        console.log(">> initializing");

        // Get reference to canvas
        canvas = document.getElementById("myCanvas");
        // Set canvas to as wide/high as the browser window
        canvas.width = 800;
        canvas.height = 600;
        // Create stage object
        stage = new createjs.StageGL(canvas);
        stage.setClearColor("#669900");
        stage.enableMouseOver(10);

        // Construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.on("allAssetsLoaded", onReady);
        // Load the assets
        assetManager.loadAssets(manifest);
    }

    main();


})(); 