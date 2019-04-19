/* Bot Wars 
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
    let gameStart = false;

    // Frame rate of game
    const FRAME_RATE = 26;

    // Max speed of asteroid
    const ASTEROID_MAX_SPEED = 5;

    const ASTEROID_START_DELAY = 500;
    const ASTEROID_MAX = 300;
    let asteroidPool = [];
    let laserPool = [];
    let asteroidsDestroyed = null;
    let asteroidTimer = 500;

    // Game objects
    let assetManager = null;
    let introCaption = null;
    let endCaption = null;
    let score = null;
    let background = null;
    let shooter = null;
    let asteroid = null;
    let rotation = 0;
    let laser = null;
    let index = 0;

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

        //laser = assetManager.getSprite("spritesheet");

        stage.addChild(introCaption);

        // endCaption = assetManager.getSprite("spritesheet");
        // endCaption.gotoAndStop("endCaption");
        // endCaption.x = 50;
        // endCaption.y = 50;

        shooter = new Shooter(stage, assetManager);

        for (let i = 0; i < ASTEROID_MAX; i++) {
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

        gameStart = true;

        // Start the shooter object
        shooter.setupMe();

        // asteroidPool.map(asteroid => {
        //     asteroid.setupMe();
        // });

        window.setInterval(() => {
            ++index;
            asteroidPool[index].initialize();
            //asteroidPool[index].move();
        }, asteroidTimer);

        asteroidsDestroyed = 0;

        //asteroidTimer = window.setInterval(onAddAsteroid, ASTEROID_START_DELAY);

        // Current state of keys
        leftKey = false;
        rightKey = false;

        // Event listeners for keyboard keys
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;
    }

    // function onAddAsteroid(e) {
    //     // find bug in pool and add to game
    //     for (let i=0; i<asteroidPool.length; i++) {
    //         let newAsteroid = asteroidPool[i];
    //         if (newAsteroid.active === false) {
    //             newAsteroid.active = true;
    //             newAsteroid.setupMe();
    //             //newAsteroid.releaseMe();
    //             break;
    //         }
    //     }
    // }

    function onKeyDown(e) {
        // Which keystrokes are left and right?


        switch (e.keyCode) {
            // hit spacebar
            case 32:
                //console.log("shoot!");
                //shooter.fire(new Laser(stage, assetManager), rotation-90);
                laserPool.push(new Laser(stage, assetManager));
                laser = laserPool[laserPool.length - 1].laser;
                laser.gotoAndStop("laser");
                laser.setTransform(400, 275, 0.1, 0.1, rotation - 90);
                stage.addChild(laser);
                spacebar = true;
                break;
            case 37:
                leftKey = true;
                rightKey = false;
                break;
            case 39:
                rightKey = true;
                leftKey = false;
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

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function isCollision(laser, asteroid) {

    }

    function onTick(e) {
        // Testing FPS of game
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        // ** Other logic here **

        if (rotation % 360 === 0 || rotation % -360 === 0) {
            rotation = 0;
        }

        if (leftKey) {
            rotation -= 10;
            shooter.rotate(rotation);
        }

        if (rightKey) {
            rotation += 10;
            shooter.rotate(rotation);
        }

        if (spacebar) {
            if (rotation % 90 === 0) {
                if (rotation === 0) laser.y -= 20;
                else if (rotation === 90) laser.x += 20;
                else if (rotation === 180) laser.y += 20;
                else laser.x -= 20;
            }
            else if (rotation > 0 && rotation < 90) {
                laser.x += 20 * Math.sin(degToRad(rotation));
                laser.y -= 20 * Math.cos(degToRad(rotation));
            } else if (rotation > 90 && rotation < 180) {
                laser.x += 20 * Math.sin(degToRad(180 - rotation));
                laser.y += 20 * Math.cos(degToRad(180 - rotation));
            } else if (rotation > 180 && rotation < 270) {
                laser.x -= 20 * Math.sin(degToRad(180 + rotation));
                laser.y += 20 * Math.cos(degToRad(180 + rotation));
            } else {
                laser.x -= 20 * Math.sin(degToRad(360 - rotation));
                laser.y -= 20 * Math.cos(degToRad(360 - rotation));
            }

            asteroidPool.forEach(asteroid => {
                let dx = asteroid.asteroid.x - laser.x;
                let dy = asteroid.asteroid.y - laser.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= 45) {
                    console.log("collision detected");
                    asteroid.destroy();
                }

                asteroid.update();
            });




        }






        // if (laser.x == asteroidPool[0].asteroid.x && laser.y == asteroidPool[0].asteroid.y) {
        //     console.log("collision");
        // }

        // if (asteroidPool[0].asteroid.x >= laser.x + laser.width || asteroidPool[0].asteroid.x + asteroidPool[0].asteroid.width <= laser.x || asteroidPool[0].asteroid.y >= laser.y + laser.height || asteroidPool[0].asteroid.y + asteroidPool[0].asteroid.height <= laser.y) {
        //     console.log("collision detected");
        // }







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