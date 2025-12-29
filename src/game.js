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
    let gameOver = false;
    const explosion = document.querySelector("#explosion");
    const shot = document.querySelector("#laser");

    const FRAME_RATE = 26;

    const ASTEROID_START_DELAY = 500;
    const ASTEROID_LASER_CONTACT_THRESHOLD = 45;
    let asteroidPool = [];
    let laserPool = [];

    // Game objects
    let assetManager = null;
    let introCaption = null;
    let endCaption = null;
    let background = null;
    let shooter = null;
    let rotation = 0;

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

        // Initialize the shooter
        shooter = new Shooter(stage, assetManager);

        // Start the asteroid timer
        window.setInterval(onInitializeAsteroid, ASTEROID_START_DELAY);

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
        gameOver = false;
        // Remove caption and reset game
        stage.removeChild(endCaption);
        rotation = 0;
        shooter.reset();
        // Remove any asteroids and lasers remaining on screen
        asteroidPool.forEach(asteroid => stage.removeChild(asteroid.sprite));
        laserPool.forEach(laser => stage.removeChild(laser.sprite));
        asteroidPool = [];
        laserPool = [];
    }

    function onInitializeAsteroid() {
        // Setup last asteroid object in pool
        let asteroid = new Asteroid(stage, assetManager);
        asteroid.initialize();
        asteroidPool.push(asteroid);
        console.log("asteroids: " + asteroidPool.length);
    }

    function onKeyDown(e) {
        // Which keystroke was pressed?
        switch (e.keyCode) {
            // Hit spacebar
            case 32:
                if (!gameOver) {
                    shot.play();
                    // Push new laser into object pool and initialize
                    let laser = new Laser(stage, assetManager, rotation - 90);
                    laserPool.push(laser);
                    spacebar = true;
                }
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
            default:
                console.log("Some other button pressed");
                break;
        }
    }

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 37:
            case 39:
                leftKey = false;
                rightKey = false;
                break;
            default:
                break;
        }
    }

    function isCollision(object1, object2) {
        // Calculate difference between x and y coordinates of sprites
        let dx = object1.sprite.x - object2.sprite.x;
        let dy = object1.sprite.y - object2.sprite.y;
        // Get distance between sprites using Pythagorean Theorem
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= ASTEROID_LASER_CONTACT_THRESHOLD;
    }

    function onTick(e) {
        // Testing FPS of game
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // TODO: Remove asteroids and lasers from their respective pool if no longer displayed on screen
        updateEntityPositions(asteroidPool);
        updateEntityPositions(laserPool);

        // if (asteroidPool.length > 1) {
        //     asteroidPool = asteroidPool.filter(asteroid => isDisplayedOnScreen(asteroid.sprite));
        // }

        if (!gameOver) {
            asteroidPool.forEach(asteroid => {
                if (!shooter.exploding && isCollision(shooter, asteroid)) {
                    gameOver = true;
                    explosion.play();
                    shooter.destroy();
                }
            });

            // rotation = ((rotation % 360) + 360) % 360;

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
                // Detect collisions
                asteroidPool.forEach((asteroid, index) => {
                    // TODO: compare locations of all lasers against the location of all asteroids
                    let laser = laserPool[laserPool.length - 1];
                    if (laser != null && isCollision(laser, asteroid)) {
                        explosion.play();
                        asteroid.destroy();
                        // Remove destroyed asteroid from object pool
                        asteroidPool.splice(index, 1);
                    }
                });
            }
        }

        // Update the stage!
        stage.update();
    }

    function updateEntityPositions(entities) {
        entities.forEach(entity => entity.sprite.mover.update());
    }

    function isDisplayedOnScreen(sprite) {
        // displayed on screen when x coordinate (plus width of sprite?) is less than width of canvas AND y coordinate 
        // (plus height of sprite) is less than height of canvas
        // and x coordinate is greater than 0 and y coordinate is greater than 0
        return sprite.x + sprite.getTransformedBounds().width < canvas.width && sprite.y + sprite.getTransformedBounds().height < canvas.height
            && sprite.x > 0 && sprite.y > 0;
    }

    // ------------------------------------------------------------------------- Entry point of game
    function main() {
        // Get reference to canvas
        canvas = document.getElementById("myCanvas");
        // Set canvas to be as wide/high as the browser window
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