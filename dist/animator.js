"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animator = (function () {
    function Animator(compositor, context, deltaTime) {
        if (deltaTime === void 0) { deltaTime = 1 / 60; }
        this.accumulatedTime = 0;
        this.lastTime = 0;
        this.deltaTime = deltaTime;
        this.compositor = compositor;
        this.context = context;
        this.update = this.update.bind(this);
    }
    Animator.prototype.enqueue = function () {
        window.requestAnimationFrame(this.update);
    };
    Animator.prototype.update = function (time) {
        this.accumulatedTime += (time - this.lastTime) / 1000;
        if (this.accumulatedTime > 1) {
            this.accumulatedTime = 1;
        }
        while (this.accumulatedTime > this.deltaTime) {
            this.compositor.update(this.deltaTime);
            this.accumulatedTime -= this.deltaTime;
        }
        this.compositor.drawOnTo(this.context);
        this.lastTime = time;
        this.enqueue();
    };
    Animator.prototype.start = function () {
        this.enqueue();
    };
    return Animator;
}());
exports.Animator = Animator;
//# sourceMappingURL=animator.js.map