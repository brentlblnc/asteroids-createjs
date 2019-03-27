class MoverDiagonal {
    
    constructor(sprite, stage) {
        // private property variables
        this._speed = 2;
        this._moving = false;
        this._sprite = sprite;
        this._stage = stage;
        // private variables
        this._xDisplace = -1;
        this._yDisplace = -1;
        
        // construct custom event object for object moving off stage
        this._eventOffStage = new createjs.Event("stageExitDiagonal", true);
        
        // sprite not animating on construction
        sprite.stop();
    }
    
    // --------------------------------------------------- get/set methods
    set speed(value) {
        this._speed = value;
    }
    
    get moving() {
        return this._moving;   
    }
    
    // -------------------------------------------------- private methods
    _radianMe(degrees) {
        return (degrees * (Math.PI / 180));
    }        
    
    // --------------------------------------------------- public methods
    startMe() {
        if (!this._moving) {
            // convert current rotation of object to radians
            let radians = this._radianMe(this._sprite.rotation);
            // calculating X and Y displacement
            this._xDisplace = Math.cos(radians) * this._speed;
            this._yDisplace = Math.sin(radians) * this._speed;
            this._sprite.play();
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
            this._sprite.x = this._sprite.x + this._xDisplace;
            this._sprite.y = this._sprite.y + this._yDisplace;

            // get dimenstions of current frame in sprite
            let dimensions = this._sprite.getBounds();
            let width = dimensions.width;
            let height = dimensions.height;

            // check if object is off the stage
            if ((this._sprite.x < -width) || (this._sprite.x > (this._stage.canvas.width + width)) || (this._sprite.y < -height) || (this._sprite.y > (this._stage.canvas.height + height))) {
                this._sprite.dispatchEvent(this._eventOffStage);
            }
        }
    }
}