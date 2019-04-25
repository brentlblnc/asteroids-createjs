class Shooter {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
        this._assetManager = assetManager;
        this._shooterKilled = new createjs.Event("shooterKilled", true);
    }

    // ------------------------------ Get/set methods
    get sprite() {
        return this._sprite;
    }

    // ------------------------------ Public methods

    initialize() {
        // Setup flags and scaling properties
        this._killed = false;
        this._sprite.setTransform(400, 300, 0.2, 0.2, 0);
        this._sprite.gotoAndStop("rotateClockwise");
        this._stage.addChild(this._sprite);
    }

    rotate(angle) {
        // Rotate shooter sprite
        this._sprite.rotation = angle;
    }

    reset() {
        this._sprite.setTransform(400, 300, 0.2, 0.2);
        this._sprite.gotoAndStop("rotateClockwise");
        this._sprite.rotation = 0;
    }

    destroy() {
        // Explode shooter
        this._sprite.gotoAndPlay("explosion");
        this._sprite.on("animationend", e => {
            // Stop animation from looping
            this._sprite.stop();
            e.remove();
            this._sprite.dispatchEvent(this._shooterKilled);
            this._stage.removeChild(this._sprite);
        });
    }
}