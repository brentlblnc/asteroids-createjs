class Shooter {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
        this._shooterKilled = new createjs.Event("shooterKilled", true);
        this._exploding = false;
        this.reset();
    }

    // ------------------------------ Get/set methods
    get sprite() {
        return this._sprite;
    }

    get exploding() {
        return this._exploding;
    }

    // ------------------------------ Public methods
    reset() {
        // Setup flags and scaling properties
        this._killed = false;
        this._sprite.setTransform(400, 300, 0.2, 0.2, 0);
        this._sprite.gotoAndStop("rotateClockwise");
        this._stage.addChild(this._sprite);
        this.rotate(0);
    }

    rotate(angle) {
        // Rotate shooter sprite
        this._sprite.rotation = angle;
    }

    destroy() {
        // Explode shooter
        this._sprite.gotoAndPlay("explosion");
        this._exploding = true;
        this._sprite.on("animationend", e => {
            // Stop animation from looping
            this._sprite.stop();
            this._exploding = false;
            e.remove();
            this._sprite.dispatchEvent(this._shooterKilled);
            this._stage.removeChild(this._sprite);
        });
    }
}