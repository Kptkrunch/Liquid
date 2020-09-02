const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove', (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;
    // console.log(mouse.x, mouse.y);
})

class Button {

    constructor(x, y, width, height, baseX) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.baseX = x;
        this.flowingRight = false;
    }

    update() {

        let directionx = 2.2;
        
        if ((mouse.x < this.x + this.width && 
             mouse.x > this.x &&
             mouse.y < this.y + this.height &&
             mouse.y > this.y
             ) && (this.x > this.baseX - 50)) {

            this.x -= directionx;
            this.width += directionx;

        } else if (this.x < this.baseX) {
            this.x += directionx;
            this.width -= directionx;
        }
    }

    draw() {
        ctx.fillStyle = 'transparent';
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }
}

const buttons = [];
const createButtons = () => {

    for (let i = 0; i < 5; i++) {

        let topMargin = 158;
        let buttonMargin = 5;
        let x = 150;
        let y = topMargin + ((50 + buttonMargin) * i);
        let height = 50;
        let width = 200;
        buttons.push(new Button(x, y, width, height));
    }
}

createButtons();

const drawButtons = () => {

    for (let i = 0; i < buttons.length; i++) {

        buttons[i].update();
        buttons[i].draw();
    }
}

// handle waterfall particles
class Particle {

    constructor(x, y, size, weight) {

        this.x = x;
        this.y = y;
        this.size = size;
        this.weight = weight; 
    }

    update() {

        // check for collisionwith mouse
        if (this.x > mouse.x - 50 &&
            this.x < mouse.x + 50 &&
            this.y > mouse.y - 5 &&
            this.y < mouse.y + 5) {

                this.x -= this.weight;
                this.y += this.weight;
                this.flowingRight = true;
            }

        // check for collision with buttons
        for (let i = 0; i < buttons.length; i++) {

            if (this.x < buttons[i].x + buttons[i].width &&
                this.x > buttons[i].x &&
                this.y < buttons[i].y + buttons[i].height &&
                this.y > buttons[i].y) {

                this.weight = 0;

                if (!this.flowingRight) {
                    this.x -= 4;
                } else {
                    this.x += 4;
                }

            } else {

                this.weight += 0.03;
            }
        }
        if (this.y > canvas.height) {

            this.y = 0 - this.size;
            this.x = (Math.random() * 60) + 200;
            this.weight = (Math.random() * 0.5) + 1.15;
            this.flowingRight = false;
        }
        this.y += this.weight;
    }
    draw() {
        ctx.fillStyle = 'rgba(128, 197, 222, 1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}
const particleArray = [];
const numberOfParticles = 80;

const createParticles = () => {

    for (let i = 0; i < numberOfParticles; i++) {

        const x = (Math.random() * 60) + 200;
        const y = (Math.random() * canvas.height);
        const size = (Math.random() * 20) + 5;
        const weight = (Math.random() * 0.3) + 1.15;
        particleArray.push(new Particle(x, y, size, weight));
    }
}
createParticles();

// animate canvas
const animate = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {

        particleArray[i].update();
        particleArray[i].draw();
    }
    drawButtons();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', (event) => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})