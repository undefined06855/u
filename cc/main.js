/*
 * Just for future reference:
 * 1x: unknown state, x being the state
*/

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

ctx.textAlign = "center"
ctx.lineWidth = 10

const bg = document.getElementById("wrapper")

function init()
{
    cc_banner.addEventListener("load", () => loaded++)
    cc_menu.addEventListener("load", () => loaded++)
    cc_banner.src = "./CC_BANNER.png"
    cc_menu.src = "./CC_MENU.png"

    setTimeout(() => {
        bg.style.backgroundColor = curBG
        canvas.style.backgroundColor = curBG
        flags.finishedFadingIn = true
    }, 500)

    requestAnimationFrame(frame)
}

function frame()
{
    curFrame++
    if (flags.finishedFadingIn)
    {
        bg.style.backgroundColor = curBG
        canvas.style.backgroundColor = curBG
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (loaded == 2)
    {
        switch(state)
        {
            case 0:
                // title
                ctx.drawImage(cc_banner, 0, 0, canvas.width, h, 0, 0, canvas.width, h)
                start_btn.draw()
                option_btn.draw()
                //ctx.drawImage(cc_menu, 0, 85, h, 85, h - 187.5*option_scale, 696.875 - (46.875*option_scale), 375*option_scale, 57*option_scale)
                ctx.fillStyle = "#f00"
                // draw option bounding box:
                //ctx.fillRect(option_coords.x1, option_coords.y1, option_coords.x2 - option_coords.x1, option_coords.y2 - option_coords.y1)
                // draw start bounding box:
                //ctx.fillRect(start_coords.x1, start_coords.y1, start_coords.x2 - start_coords.x1, start_coords.y2 - start_coords.y1)
            
                break

            case 1:
                // game
                if (scoreFrom == 0 && scoreTo == 0) recalcScore()

                ctx.fillStyle = "#555"
                ctx.font = "240px Fredoka One"
                ctx.fillText(score, h, h + 60)

                const rscoreFrom = (scoreFrom-90) * (Math.PI / 180)
                const rscoreTo = (scoreTo-90) * (Math.PI / 180)

                ctx.fillStyle = darkenRGB(curBG, .5)
                ctx.beginPath()
                ctx.arc(h, h, 450, -rscoreTo, -rscoreFrom, false)
                ctx.arc(h, h, 350, -rscoreFrom, -rscoreTo, true)
                ctx.stroke()
                ctx.fill()
                ctx.closePath()

                player.update()

                break
                
            case 2:
                ctx.drawImage(cc_banner, 0, h + 150, canvas.width, 150, 0, 400, canvas.width, 150)

                back_btn.draw()

                break

            default: alert("An unknown error occured!\n(Error code: 1%s)\n\nThe website will now refresh.".replace("%s", state)); frame = () => {}; window.location.reload()
        }

        buttons.forEach(button => button.updateScale())

        if (state !== 1)
        {
            if (mouseX > canvas.width + 20)  mouseX = -20
            if (mouseX < -20)                mouseX = canvas.width + 20
            if (mouseY > canvas.height + 20) mouseY = -20
            if (mouseY < -20)                mouseY = canvas.height + 20

            if (isNaN(mouseX)) mouseX = h
            if (isNaN(mouseY)) mouseY = h
    
            ctx.beginPath()
            var fs = ctx.createRadialGradient(mouseX, mouseY, 15, mouseX, mouseY, 25)
            fs.addColorStop(0, "#0000")
            fs.addColorStop(1, "#000f")
            ctx.fillStyle = fs
            ctx.lineWidth = 1
            ctx.arc(mouseX, mouseY, 25, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
            ctx.lineWidth = 10

            // draw debug lines
            ctx.strokeStyle = "#f00"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(0, h)
            ctx.lineTo(canvas.width, h)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(h, 0)
            ctx.lineTo(h, canvas.height)
            ctx.stroke()

            ctx.strokeStyle = "#000"
            ctx.lineWidth = 10

            ctx.fillStyle = "#fff"
            ctx.font = "16px Helvetica"
            ctx.fillText(curFrame, 100, 100)
            ctx.fillText(curBG, 100, 118)

        }

    }
    else
    {
        curFrame = -1
        ctx.fillStyle = "#fff"
        ctx.font = "30px Helvetica"
        ctx.fillText("Loading...", h, h - 35)
    }

    requestAnimationFrame(frame)
}

function recalcScore()
{
    const width = Math.random()*70 + 30
    const startOffset = Math.random() * (360 - width)

    scoreFrom = startOffset
    scoreTo = startOffset + width

    scoreTo < scoreFrom && recalcScore()
}

function fit()
{
    canvas.style.width = Math.min(document.body.offsetWidth, document.body.offsetHeight) + "px"
    canvas.style.height = Math.min(document.body.offsetWidth, document.body.offsetHeight) + "px"
}

window.addEventListener("resize", fit)
fit()

function fadeTo(nextState)
{
    if (curBG != "#000")
    {
        lastBG = curBG
        curBG = "#000"
        setTimeout(() => {
            state = nextState
            curBG = lastBG
        }, 500)
    }
}

function popup(message)
{
    document.getElementById("popup").children[0].innerText = message
    document.getElementById("popup").children[1].innerText = "Click to continue..."
    document.getElementById("popup").style.transform = "scale(1)"
}

// https://stackoverflow.com/a/9493060/17242873 (compressed with chatGPT)
function hslToRgb(h,s,l){var r,g,b;if(s==0){r=g=b=l}else{var a=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p};var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;r=a(p,q,h+1/3);g=a(p,q,h);b=a(p,q,h-1/3)}return[Math.round(r*255),Math.round(g*255),Math.round(b*255)]}

// chatGPT:
function darkenRGB(c,f){const[r,g,b]=c.slice(4,-1).split(',').map(x=>Math.round(x*f));return`rgb(${r},${g},${b})`}

function mouseController(e, type)
{
    if (state == 1)
    {
        mouseX += h
        mouseY += h
    }
    else
    {
        mouseX += e.movementX
        mouseY += e.movementY
    }


    if (type == "move")
    {
        buttons.forEach(btn => {
            btn.testHover()
        })
    }
    else if (type == "key") e.code == "Space" && !e.repeat && player.click()
    else
    {
        if (flags.gotPastPopupMenu)
        {
            if (state == 1) player.click()
            buttons.forEach(btn => btn.testClick())
        }
        else
        {
            // on initial popup!
            canvas.requestPointerLock()
            flags.gotPastPopupMenu = true
            document.getElementById("popup").style.transform = "scaleY(0)"
            setTimeout(() => {
                document.getElementById("wrapper").requestFullscreen()
            }, 500)
            setTimeout(() => {
                document.addEventListener("fullscreenchange", () => {flags.gotPastPopupMenu = false; console.log("fs exit"); popup("You have exited fullscreen.")})
                !flags.initialPopupShown && init()
                flags.initialPopupShown = true
            }, 1500)
        }
    }
}

if (!BLOCKED)
{
    document.addEventListener("mousemove", e => mouseController(e, "move"))
    document.addEventListener("mousedown", e => mouseController(e, "click"))
    document.addEventListener("keydown", e => mouseController(e, "key"))
}

class Button
{
    // tex_x and tex_y are indexes into the texture sheet cc_menu
    constructor(x, y, tex_x, tex_y, name, state, redirect)
    {
        this.x = x
        this.y = y
        this.tex_x = tex_x * h
        this.tex_y = tex_y * 85
        this.name = name

        this.state = state
        this.redirect = redirect

        this.hovered = false

        this.scale = 1

        buttons.push(this)
    }

    draw()
    {
        ctx.fillStyle = "#f00"

        ctx.fillRect(this.x - h/2, this.y - h/2, h, 85)

        ctx.drawImage(cc_menu, this.tex_x, this.tex_y, h, 85, this.x - h/2, this.y - h/2, h*this.scale, 85*this.scale)
    }

    updateScale()
    {
        if (this.hovered && this.scale < 1.2) this.scale += 0.05
        if (!this.hovered && this.scale > 1.0) this.scale -= 0.05
    }

    testHover()
    {
        if (this.x - h/2 < mouseX && mouseX < this.x + h/2 && this.y - h/2 < mouseY && mouseY < this.y + h/2) { this.hovered = true; console.log("hover " + this.name) }
        else                                                                                                  { this.hovered = false }
    }

    testClick() { this.hovered && state == this.state && fadeTo(this.redirect) }
}

class Player
{
    constructor()
    {
        this.rotation = 0
        this.x = 0
        this.y = 0
        this.offset = 400
        this.col = "#fff"
        this.radius = 45
        this.reversed = false
        this.speed = 1
        this.speedInc = 0.5
    }

    update()
    {
        this.rotation += this.reversed ? -this.speed : this.speed
        this.calcRot()
        this.draw()
    }

    draw()
    {
        if (flags.currentlyDecrementingPlayerSize && this.radius >= 30) this.radius -= 10
        if (flags.currentlyIncrementingPlayerSize && this.radius <= 45) this.radius += 1
        if (flags.currentlyDecrementingPlayerSize && this.radius <= 30) { flags.currentlyIncrementingPlayerSize = true; flags.currentlyDecrementingPlayerSize = false; this.radius = 30}

        ctx.fillStyle = this.col
        ctx.beginPath()
        //ctx.fillStyle = this.col
        ctx.arc(this.x + h, this.y + h, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }

    calcRot()
    {
        this.rotation = this.rotation % 360
        if (this.rotation < 0) this.rotation += 360
        const rad = this.rotation * (Math.PI / 180)

        this.x = this.offset * Math.sin(rad)
        this.y = this.offset * Math.cos(rad)
    }

    click()
    {
        if (state == 1)
        {
            flags.currentlyDecrementingPlayerSize = true

            if (scoreTo > this.rotation && this.rotation > scoreFrom)
            {
                score++
                this.reversed = !this.reversed
                this.speed += this.speedInc
                
                const bg = hslToRgb(Math.random(), 1, .5)
                curBG = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`

                recalcScore()
            }
            else state = 2
        }
    }
}

var score = 0

var scoreFrom = 0
var scoreTo = 0

var curBG = "#000"
var lastBG = "#000"

var startHue = Math.random()

var hslbg = hslToRgb(startHue, 1, .5)
curBG = `rgb(${hslbg[0]}, ${hslbg[1]}, ${hslbg[2]})`

var speed = 0.25
var player = new Player()

var state = 0
var loaded = 0

const h = canvas.width / 2

var curFrame = 0

var buttons = []

var mouseX = h
var mouseY = h

var cc_banner = new Image()
var cc_menu = new Image()

var flags = {
    currentlyIncrementingStartScale: false,
    currentlyIncrementingOptionScale: false,
    currentlyDecrementingStartScale: true,
    currentlyDecrementingOptionScale: true,

    currentlyIncrementingPlayerSize: false,
    currentlyDecrementingPlayerSize: false,

    finishedFadingIn: false,

    gotPastPopupMenu: false,
    initialPopupShown: false
}

const start_btn = new Button(h, h, 0, 0, "start", 0, 1)
const option_btn = new Button(h, h + 300, 0, 2, "option", 0, .5)
const back_btn = new Button(h, h + 600, 0, 3, "back", 2, 0)