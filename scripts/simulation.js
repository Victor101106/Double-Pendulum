import { Pendulum } from "./pendulum.js"

const trajectory = document.getElementById('trajectory')
const trajectoryContext = trajectory.getContext('2d')
const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

const pendulum1 = new Pendulum(Math.PI / 2, 20, 100, 0, 0)
const pendulum2 = new Pendulum(Math.PI / 2, 20, 100, 0, 0)

const offsetY = canvas.height / 2.5
const offsetX = canvas.width / 2 

let previousX = undefined
let previousY = undefined

const timestamp = 1
const gravity = 0.5
const scale = 1.8

function update() {

    for (let index = 0; index < timestamp; index++) {

        const denominator = 2 * pendulum1.mass + pendulum2.mass - pendulum2.mass * Math.cos(2 * pendulum1.angle - 2 * pendulum2.angle)

        const acceleration_1 = -gravity * (2 * pendulum1.mass + pendulum2.mass) * Math.sin(pendulum1.angle)
        const acceleration_2 = -pendulum2.mass * gravity * Math.sin(pendulum1.angle - 2 * pendulum2.angle)
        const acceleration_3 = -2 * Math.sin(pendulum1.angle - pendulum2.angle) * pendulum2.mass
        const acceleration_4 = pendulum2.velocity * pendulum2.velocity * pendulum2.radius + pendulum1.velocity * pendulum1.velocity * pendulum2.radius * Math.cos(pendulum1.angle - pendulum2.angle)

        const acceleration_5 = 2 * Math.sin(pendulum1.angle - pendulum2.angle)
        const acceleration_6 = pendulum1.velocity * pendulum1.velocity * pendulum1.radius * (pendulum1.mass + pendulum2.mass)
        const acceleration_7 = gravity * (pendulum1.mass + pendulum2.mass) * Math.cos(pendulum1.angle)
        const acceleration_8 = pendulum2.velocity * pendulum2.velocity * pendulum2.radius * pendulum2.mass * Math.cos(pendulum1.angle - pendulum2.angle)

        pendulum1.acceleration = (acceleration_1 + acceleration_2 + acceleration_3 * acceleration_4) / (pendulum1.radius * denominator)
        pendulum2.acceleration = (acceleration_5 * (acceleration_6 + acceleration_7 + acceleration_8)) / (pendulum2.radius * denominator)

        pendulum1.calculate(0, 0)
        pendulum2.calculate(pendulum1.x, pendulum1.y)   

        draw()

    }

    requestAnimationFrame(update)

}

function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.lineWidth = 1 * scale

    // ? Line 1
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    context.strokeStyle = 'rgb(40, 40, 40)'
    context.lineTo(offsetX + pendulum1.x * scale, offsetY + pendulum1.y * scale)
    context.stroke()
    
    // ? Line 2
    context.beginPath()
    context.strokeStyle = '#000'
    context.moveTo(offsetX + pendulum1.x * scale, offsetY + pendulum1.y * scale)
    context.lineTo(offsetX + pendulum2.x * scale, offsetY + pendulum2.y * scale)
    context.stroke()
    
    // ? Pendulum 1
    context.beginPath()
    context.fillStyle = 'rgb(40, 40, 40)'
    context.arc(offsetX + pendulum1.x * scale, offsetY + pendulum1.y * scale, 10 * scale, 0, 2 * Math.PI)
    context.fill()
    
    // ? Pendulum 2
    context.beginPath()
    context.fillStyle = '#000'
    context.arc(offsetX + pendulum2.x * scale, offsetY + pendulum2.y * scale, 10 * scale, 0, 2 * Math.PI)
    context.fill()

    // ? Trajectory
    if (previousX && previousY) {
        trajectoryContext.beginPath()
        trajectoryContext.strokeStyle = 'rgb(100, 100, 100)'
        trajectoryContext.globalAlpha = 0.5
        trajectoryContext.moveTo(offsetX + previousX * scale, offsetY + previousY * scale)
        trajectoryContext.lineTo(offsetX + pendulum2.x * scale, offsetY + pendulum2.y * scale)
        trajectoryContext.stroke()
        trajectoryContext.strokeStyle = '#000'
        trajectoryContext.globalAlpha = 1
    }
    
    // ? Previous
    previousX = pendulum2.x
    previousY = pendulum2.y

}

function adjust() {

    if (window.innerHeight > window.innerWidth) {
        trajectory.style.height = 'auto'
        trajectory.style.width = '90%'
        canvas.style.height = 'auto'
        canvas.style.width = '90%'
        return
    }

    trajectory.style.height = '90%'
    trajectory.style.width = 'auto'
    canvas.style.height = '90%'
    canvas.style.width = 'auto'

}

window.onresize = adjust
window.onload = () => {
    adjust()
    update()
}