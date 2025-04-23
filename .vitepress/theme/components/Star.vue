<template>
    <canvas ref="canvas" class="star-canvas"></canvas>
  </template>
  
  <script>
  export default {
    name: "StarCanvas",
    data() {
      return {
        arr: [], // 存放每个星星的信息
        colours: ["#ffff00", "#66ffff", "#3399ff", "#99ff00", "#ff9900"], // 颜色数组
        canvas: null,
        ctx: null,
      };
    },
    mounted() {
      this.initCanvas();
      this.bindEvents();
      this.animate();
    },
    beforeDestroy() {
      this.unbindEvents();
    },
    methods: {
      initCanvas() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas);
      },
      resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      },
      bindEvents() {
        window.addEventListener("mousemove", this.addStars);
      },
      unbindEvents() {
        window.removeEventListener("mousemove", this.addStars);
        window.removeEventListener("resize", this.resizeCanvas);
      },
      addStars(e) {
        this.arr.push({
          x: e.clientX,
          y: e.clientY,
          r: Math.random() * 2 + 1.5,
          td: Math.random() * 4 - 2,
          dx: Math.random() * 2 - 1,
          dy: Math.random() * 1 + 1,
          rot: Math.random() * 90 + 90,
          color: this.colours[Math.floor(Math.random() * this.colours.length)],
        });
      },
      star(x, y, r, l, rot) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          this.ctx.lineTo(
            Math.cos(((18 + i * 72 - rot) * Math.PI) / 180) * r + x,
            -Math.sin(((18 + i * 72 - rot) * Math.PI) / 180) * r + y
          );
          this.ctx.lineTo(
            Math.cos(((54 + i * 72 - rot) * Math.PI) / 180) * l + x,
            -Math.sin(((54 + i * 72 - rot) * Math.PI) / 180) * l + y
          );
        }
        this.ctx.closePath();
      },
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.arr.length; i++) {
          let temp = this.arr[i];
          this.star(temp.x, temp.y, temp.r, temp.r * 3, temp.rot);
          this.ctx.fillStyle = temp.color;
          this.ctx.strokeStyle = temp.color;
          this.ctx.lineWidth = 0.1;
          this.ctx.lineJoin = "round";
          this.ctx.fill();
          this.ctx.stroke();
        }
      },
      update() {
        for (let i = 0; i < this.arr.length; i++) {
          this.arr[i].x += this.arr[i].dx;
          this.arr[i].y += this.arr[i].dy;
          this.arr[i].rot += this.arr[i].td;
          this.arr[i].r -= 0.015;
          if (this.arr[i].r < 0) {
            this.arr.splice(i, 1);
          }
        }
      },
      animate() {
        this.draw();
        this.update();
        requestAnimationFrame(this.animate);
      },
    },
  };
  </script>
  
  <style scoped>
  .star-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
  }
  </style>
  