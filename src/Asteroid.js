class Asteroid {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._destroyed = false;
        this._active = false;
        this._sprite = assetManager.getSprite("spritesheet");
        this._sprite.mover = new SpriteMover(this._sprite, stage);
        this._eventAsteroidDestroyed = new createjs.Event("asteroidDestroyed", true);
    }

    // ------------------------------ Get/set methods

    get active() {
        return this._active;
    }

    get sprite() {
        return this._sprite;
    }

    set active(val) {
        this._active = val;
    }

    // ------------------------------ Public methods
    initialize() {
        this._destroyed = false;
        this._sprite.scaleX = 0.2;
        this._sprite.scaleY = 0.2;
        this._sprite.gotoAndPlay("asteroidRotate");

        // Choose a random speed and direction 
        // this._direction = SpriteMover.Random(SpriteMover.Left, SpriteMover.Right);
        let screenSides = [SpriteMover.TopScreen, SpriteMover.BottomScreen, SpriteMover.LeftScreen, SpriteMover.RightScreen];
        let randomSide = screenSides[Math.floor(Math.random() * screenSides.length)];

        this._sprite.mover.speed = SpriteMover.Random(5, 10);

        // switch (this._direction) {
        //     case SpriteMover.Left:
        //         // Move leftward
        //         this._sprite.x = this._sprite.getBounds().width + this._stage.canvas.width;
        //         this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
        //         this._sprite.rotation = SpriteMover.Random(90, 180);
        //         if (this._sprite.y > this._stage.canvas.height / 2) {
        //             this._sprite.rotation = this._sprite.rotation - 90;
        //         }
        //         break;
        //     default:
        //         // Move rightward
        //         this._sprite.x = -this._sprite.getBounds().width;
        //         this._sprite.y = SpriteMover.Random(-this._sprite.getBounds().height, this._stage.canvas.height);
        //         this._sprite.rotation = SpriteMover.Random(0, 90);
        //         if (this._sprite.y > this._stage.canvas.height / 2) {
        //             this._sprite.rotation = this._sprite.rotation + 90;
        //         }
        //         break;
        // }
        let course = 0;

        switch (randomSide) {
            case SpriteMover.TopScreen:
                this._sprite.x = SpriteMover.Random(0, this._stage.canvas.width);
                this._sprite.y = -this._sprite.getTransformedBounds().height;
                if (this._sprite.x < this._stage.canvas.width / 2) {
                    course = SpriteMover.Random(0, 90);
                }
                if (this._sprite.x > this._stage.canvas.width / 2) {
                    course = SpriteMover.Random(90, 180);
                }
                break;
            case SpriteMover.BottomScreen:
                this._sprite.x = SpriteMover.Random(0, this._stage.canvas.width);
                this._sprite.y = this._stage.canvas.height + this._sprite.getTransformedBounds().height;
                if (this._sprite.x < this._stage.canvas.width / 2) {
                    course = SpriteMover.Random(270, 360);
                }
                if (this._sprite.x > this._stage.canvas.width / 2) {
                    course = SpriteMover.Random(180, 270);
                }
                break;
            case SpriteMover.LeftScreen:
                this._sprite.x = -this._sprite.getTransformedBounds().width;
                this._sprite.y = SpriteMover.Random(0, this._stage.canvas.height);
                if (this._sprite.y < this._stage.canvas.height / 2) {
                    this._direction = SpriteMover.Random(0, 90);
                }
                if (this._sprite.y > this._stage.canvas.height / 2) {
                    course = SpriteMover.Random(270, 360);
                }
                break;
            case SpriteMover.RightScreen:
                this._sprite.x = this._stage.canvas.width + this._sprite.getTransformedBounds().width;
                this._sprite.y = SpriteMover.Random(0, this._stage.canvas.height);
                if (this._sprite.y < this._stage.canvas.height / 2) {
                    course = SpriteMover.Random(90, 180);
                }
                if (this._sprite.y > this._stage.canvas.height / 2) {
                    course = SpriteMover.Random(180, 270);
                }
                break;
            default:
                break;
        }

        // Calculate velocity of asteroid depending on rotation
        this._sprite.mover.calculateVelocity(this._sprite, course);

        this._stage.addChild(this._sprite);
    }

    destroy() {
        this._sprite.gotoAndPlay("explosion");
        this._sprite.on("animationend", e => {
            e.remove();
            this._sprite.stop();
            this._stage.removeChild(this._sprite);
        });

    }
}