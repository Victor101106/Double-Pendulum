export class Pendulum {

    constructor(angle, mass, radius, velocity, acceleration) {
        this.acceleration = acceleration
        this.velocity = velocity
        this.radius = radius
        this.angle = angle
        this.mass = mass
    }

    calculate(offsetX, offsetY) {
        
        this.velocity = this.velocity + this.acceleration
        this.angle = this.angle + this.velocity

        this.x = offsetX + this.radius * Math.sin(this.angle)
        this.y = offsetY + this.radius * Math.cos(this.angle)

    }

}