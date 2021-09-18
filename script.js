// png to base64
import {url} from "./imgUrl.js"
const img = new Image()
img.src = url

img.addEventListener("load", () => {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = 666
  canvas.height = 1000
    
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // console.log(pixels);

  let particleArray = []
  const numbOfParticles = 6000


  let mappedImg = []
  let cellBrightness

  for(let y = 0; y < canvas.height;y++){
    let row = []
    for(let x = 0; x < canvas.width; x++){
      // logic behind 
      // row 1 
      // (0 * 4 * 400)+(0 * 4)
      // (0 * 4 * 400)+(1 * 4)
      // (0 * 4 * 400)+(2 * 4)
      // (0 * 4 * 400)+(3 * 4)...
      // devide by 3 to get average value of rgb - grayscale
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)] // each 4 elements represent red
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
      const brightness = calculateRelativeBrightness(red, green, blue)
      const cell = [
        cellBrightness = brightness,
      ]
      row.push(cell)
    }
    mappedImg.push(row)
  }
  console.log(mappedImg);

  function calculateRelativeBrightness(red, green, blue){
    return Math.sqrt(
      (red * red) * 0.199 + (green * green) * 0.887 + (blue * blue) * 0.214
    )/100
  }


  class Particle{
    constructor(){
      this.x = Math.random() * canvas.width
      this.y = 0
      this.speed = 0
      this.velocity = Math.random() * 5.5
      this.size = Math.random() * 1.5 + 1
      this.position1 = Math.floor(this.y)
      this.position2 = Math.floor(this.x)
    }
    update(){
      this.position1 = Math.floor(this.y)
      this.position2 = Math.floor(this.x)
      this.speed = mappedImg[this.position1][this.position2][0]
      let movement = (2.5 - this.speed) + this.velocity


      this.y+= movement
      if(this.y >= canvas.height){
        this.y = 0
        this.x = Math.random() * canvas.width
      }
    }
    draw(){ // draw each  particle
      ctx.beginPath()
      ctx.fillStyle = "#f56"
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
      ctx.fill()
    }
  }
  function init(){
    for(let i = 0; i < numbOfParticles; i++){
      particleArray.push(new Particle)
    }
  }
  init()
  function animate(){
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.05
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.globalAlpha = 0.2
    for(let i = 0; i < particleArray.length; i++){
      particleArray[i].update()
      ctx.globalAlpha = particleArray[i].speed * .2
      particleArray[i].draw()
    }
    requestAnimationFrame(animate)
  }
  animate()
})