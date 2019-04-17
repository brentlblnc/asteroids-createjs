class Shooter {
    constructor(stage, assetManager) {
        this._stage = stage;
        this._sprite = assetManager.getSprite("spritesheet");
        this._shooterKilled = new createjs.Event("shooterKilled", true);
    }

    // Public methods
    setupMe() {
        this._killed = false;
        this._sprite.setTransform(400, 300, 0.2, 0.2);
        this._sprite.gotoAndStop("rotateClockwise");
        this._stage.addChild(this._sprite);
    }

    rotate(rotation) {

        //this._sprite.setTransform(400, 300, 0.2, 0.2, rotation);
        this._sprite.rotation = rotation;
    }

    fire(laser, angle) {
        laser.dispatch(angle);
        //laser.setTransform(400, 275, 0.2, 0.2, angle);
        console.log("shot");
    }

    pause() {
        this._sprite.stop();
    }
}