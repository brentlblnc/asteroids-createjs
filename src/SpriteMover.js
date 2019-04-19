class SpriteMover {

    constructor(sprite, stage) {
        this._speed = 5;
        this._moving = false;
        this._sprite = sprite;
        this._stage = stage;
        this._sprite.dx = 0;
        this._sprite.dy = 0;
    }

    static Right = 1;
    static Left = 2;

    // --------------------------------------------------- get/set methods
    set speed(value) {
        this._speed = value;
    }

    get moving() {
        return this._moving;
    }



    // --------------------------------------------------- public methods
    static Random(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    static DegToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    calculateVelocity(sprite, rotation) {
        this._sprite = sprite;
        this._sprite.rotation = rotation;

        if (!this._moving) {
            // convert current rotation of object to radians
            //let radians = SpriteMover.DegToRad(this._sprite.rotation);
            // calculating X and Y displacement
            let radians = SpriteMover.DegToRad(this._sprite.rotation);
            this._sprite.dx = Math.cos(radians) * this._speed;
            this._sprite.dy = Math.sin(radians) * this._speed;
            //this._sprite.play();
            this._moving = true;
        }
    }

    stopMe() {
        if (this._moving) {
            this._sprite.stop();
            this._moving = false;
        }
    }

    update() {
        if (this._moving) {
            // move sprite
            this._sprite.x += this._sprite.dx;
            this._sprite.y += this._sprite.dy;

            // // get dimenstions of current frame in sprite
            // let dimensions = this._sprite.getBounds();
            // let width = dimensions.width;
            // let height = dimensions.height;

            // // check if object is off the stage
            // if ((this._sprite.x < -width) || (this._sprite.x > (this._stage.canvas.width + width)) || (this._sprite.y < -height) || (this._sprite.y > (this._stage.canvas.height + height))) {
            //     this._sprite.dispatchEvent(this._eventOffStage);
            // }
        }
    }
}