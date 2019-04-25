/* Asteroids (formerly Bot Wars)
   Implemented with CreateJS
   INFT4000 Special Topics I
   Brent LeBlanc
*/

(function () {

    // Game variables
    let stage = null;
    let canvas = null;
    let leftKey = false;
    let rightKey = false;
    let spacebar = false;
    const explosion = document.querySelector("#explosion");
    const shot = document.querySelector("#laser");

    // Frame rate of game
    const FRAME_RATE = 26;

    const ASTEROID_START_DELAY = 500;
    let asteroidPoolTimer = null;
    let asteroidInitializer = null;
    let asteroidPool = [];
    let laserPool = [];

    // Game objects
    let assetManager = null;
    let introCaption = null;
    let endCaption = null;
    let background = null;
    let shooter = null;
    let rotation = 0;
    let laser = null;
    let index = 0;

    function onReady(e) {
        // Remove event listener
        e.remove();

        // Construct game objects
        background = assetManager.getSprite("spritesheet");

        background.setTransform(0, 0, 0.5, 0.5);
        background.gotoAndStop("background");
        stage.addChild(background);

        introCaption = assetManager.getSprite("spritesheet");
        introCaption.setTransform(140, 180, 0.5, 0.5);
        introCaption.gotoAndStop("introCaption");

        endCaption = assetManager.getSprite("spritesheet");
        endCaption.setTransform(230, 220, 0.3, 0.3);
        endCaption.gotoAndStop("endCaption");

        stage.addChild(introCaption);

        shooter = new Shooter(stage, assetManager);

        // Event listener to start game
        background.on("click", onStartGame);

        // ** Listen for dispatched events here ** 
        stage.on("shooterKilled", onGameOver);

        // Startup the ticker
        createjs.Ticker.framerate = FRAME_RATE;
        createjs.Ticker.on("tick", onTick);
    }

    function onStartGame(e) {
        stage.removeChild(introCaption);

        // Remove click event on background
        e.remove();

        // Start the shooter object
        shooter.initialize();

        // Start the asteroid timers
        asteroidPoolTimer = window.setInterval(onAddAsteroid, 4);
        asteroidInitializer = window.setInterval(onInitializeAsteroid, ASTEROID_START_DELAY);

        // Current state of keys
        leftKey = false;
        rightKey = false;

        // Event listeners for keyboard keys
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;
    }

    function onGameOver(e) {
        stage.addChild(endCaption);
        background.on("click", onResetGame);
    }

    function onResetGame(e) {
        e.remove();
        // Remove caption and reset shooter and laser
        stage.removeChild(endCaption);
        shooter.initialize();
        laser.reset();
    }

    function onAddAsteroid() {
        // Push new asteroid object into pool
        asteroidPool.push(new Asteroid(stage, assetManager, shooter));
    }

    function onInitializeAsteroid() {
        // Setup last asteroid object in pool
        asteroidPool[index].initialize();
        index++;
    }

    function onKeyDown(e) {
        // Which keystrokes were pressed?
        switch (e.keyCode) {
            // Hit spacebar
            case 32:
                shot.play();
                // Push new laser into object pool and initialize
                laserPool.push(new Laser(stage, assetManager, rotation - 90));
                laser = laserPool[laserPool.length - 1];
                laser.initialize();
                spacebar = true;
                break;
            // Hit left key
            case 37:
                leftKey = true;
                rightKey = false;
                break;
            // Hit right key
            case 39:
                rightKey = true;
                leftKey = false;
                break;
            default: console.log("some other button");
        }
    }

    function onKeyUp(e) {
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

    function isCollision(laser, asteroid) {
        // Calculate difference between x and y coordinates of sprites
        let dx = asteroid.sprite.x - laser.sprite.x;
        let dy = asteroid.sprite.y - laser.sprite.y;
        // Get distance between sprites using Pythagorean Theorem
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 45) {
            explosion.play();
            return true;
        }
    }

    function onTick(e) {
        // Testing FPS of game
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // ** Other logic here **

        // Set angle back to 0 if 360 or -360
        if (rotation % 360 === 0 || rotation % -360 === 0) {
            rotation = 0;
        }

        // Rotate shooter if left or right keys pressed
        if (leftKey) {
            rotation -= 10;
            shooter.rotate(rotation);
        }

        if (rightKey) {
            rotation += 10;
            shooter.rotate(rotation);
        }

        if (spacebar) {
            // Update x and y coordinates of laser
            laser.update(laserPool);

            // Detect collisions
            asteroidPool.forEach((asteroid, index) => {
                if (isCollision(laser, asteroid)) {
                    asteroid.destroy();
                    // Remove destroyed asteroid from object pool
                    asteroidPool.splice(index, 1);
                }

                if (isCollision(shooter, asteroid)) {
                    shooter.destroy();
                }

                // Update x and y coordinates of asteroid
                asteroid.update();
            });
        }

        // Update the stage!
        stage.update();
    }

    // ------------------------------------------------------------------------- Entry point of game
    function main() {
        // Get reference to canvas
        canvas = document.getElementById("myCanvas");
        // Set canvas to as wide/high as the browser window
        canvas.width = 800;
        canvas.height = 600;
        // Create stage object
        stage = new createjs.StageGL(canvas, { antialias: true });
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