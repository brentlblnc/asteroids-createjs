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

    rotateCCW() {
        this._sprite.gotoAndPlay("rotateCCW");
    }

    rotateCW() {
        this._sprite.gotoAndPlay("rotateClockwise");
    }

    pause() {
        this._sprite.stop();
    }
}