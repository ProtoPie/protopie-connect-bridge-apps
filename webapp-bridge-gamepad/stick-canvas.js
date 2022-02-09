class StickCanvas {
  constructor({ size, name, backgroundColor }) {
    this.name = name;
    this.size = size;
    this.lineWidth = 4;
    this.backgroundColor = backgroundColor;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setScale();
    this.draw(0, 0);
  }

  setScale() {
    this.canvas.name = this.name;
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.canvas.style.width = this.size + 'px';
    this.canvas.style.height = this.size + 'px';

    const scale = window.devicePixelRatio;
    this.canvas.width = Math.floor(this.size * scale);
    this.canvas.height = Math.floor(this.size * scale);

    this.ctx.scale(scale, scale);
  }

  p2px(p) {
    return Math.max(0, Math.round((p * 180 + 180) / 2) + 10);
  }

  drawPointer(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(this.p2px(x, 4), this.p2px(y, 4), 4, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }

  drawGameController(canvas) {
    this.ctx.beginPath();
    this.ctx.arc(200 / 2, 200 / 2, 90, 0, Math.PI * 2);
    this.ctx.moveTo(10, 100);
    this.ctx.lineTo(190, 100);
    this.ctx.moveTo(100, 10);
    this.ctx.lineTo(100, 190);
    this.ctx.closePath();
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
  }

  draw(x, y) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGameController();
    this.drawPointer(x, y);
  }
}

window.StickCanvas = StickCanvas;
