/**
 * Add notification badge (pill) to favicon in browser tab
 * @url stackoverflow.com/questions/65719387/
 */
class Badger {
  canvas;
  ctx;

  constructor(options) {
    Object.assign(
      this,
      {
        backgroundColor: "rgba(255, 0, 106, 1)",
        color: "#fff",
        size: 0.6, // 0..1 (Scale in respect to the favicon image size)
        position: "se", // Position inside favicon "n", "e", "s", "w", "ne", "nw", "se", "sw"
        radius: 4, // Border radius
        src: "", // Favicon source (dafaults to the <link> icon href)
        value: "", // Badge value (text)
        onChange() {},
      },
      options
    );

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  _drawIcon() {
    this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize);
    this.ctx.drawImage(this.img, 0, 0, this.faviconSize, this.faviconSize);
  }

  _drawBgrBorder() {
    const r = this.radius + 1;
    const xa = this.offset.x - 1;
    const ya = this.offset.y - 1;
    const xb = this.offset.x + this.badgeSize + 2;
    const yb = this.offset.y + this.badgeSize + 2;
    this.ctx.beginPath();
    this.ctx.moveTo(xb - r, ya);
    this.ctx.quadraticCurveTo(xb, ya, xb, ya + r);
    this.ctx.lineTo(xb, yb - r);
    this.ctx.quadraticCurveTo(xb, yb, xb - r, yb);
    this.ctx.lineTo(xa + r, yb);
    this.ctx.quadraticCurveTo(xa, yb, xa, yb - r);
    this.ctx.lineTo(xa, ya + r);
    this.ctx.quadraticCurveTo(xa, ya, xa + r, ya);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.closePath();
  }

  _drawBgr() {
    const r = this.radius;
    const xa = this.offset.x;
    const ya = this.offset.y;
    const xb = this.offset.x + this.badgeSize;
    const yb = this.offset.y + this.badgeSize;
    this.ctx.beginPath();
    this.ctx.moveTo(xb - r, ya);
    this.ctx.quadraticCurveTo(xb, ya, xb, ya + r);
    this.ctx.lineTo(xb, yb - r);
    this.ctx.quadraticCurveTo(xb, yb, xb - r, yb);
    this.ctx.lineTo(xa + r, yb);
    this.ctx.quadraticCurveTo(xa, yb, xa, yb - r);
    this.ctx.lineTo(xa, ya + r);
    this.ctx.quadraticCurveTo(xa, ya, xa + r, ya);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
    this.ctx.closePath();
  }

  _drawSymbol() {
    const margin = (this.badgeSize * 0.18) / 2;
    this.ctx.beginPath();
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.font = `bold ${this.badgeSize}px Arial`;
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(
      "•",
      this.badgeSize / 2 + this.offset.x,
      this.badgeSize / 2 + this.offset.y + margin
    );
    this.ctx.closePath();
  }

  _draw() {
    this._drawIcon();
    //this._drawShapeBgr();
    this._drawBgr();
    this._drawSymbol();
  }

  _setup() {
    console.log("setting up");
    this.faviconSize = this.img.naturalWidth;
    this.badgeSize = this.faviconSize * this.size;
    this.canvas.width = this.faviconSize;
    this.canvas.height = this.faviconSize;

    const sd = this.faviconSize - this.badgeSize;
    const sd2 = sd / 2;
    this.offset = {
      n: { x: sd2, y: 0 },
      e: { x: sd, y: sd2 },
      s: { x: sd2, y: sd },
      w: { x: 0, y: sd2 },
      nw: { x: 0, y: 0 },
      ne: { x: sd, y: 0 },
      sw: { x: 0, y: sd },
      se: { x: sd, y: sd },
    }[this.position];
  }

  // Public functions / methods:

  update(callback) {
    console.log("updating");
    this.img = new Image();

    // Set up the onload event to draw the image on the canvas
    this.img.onload = () => {
      // Set up the canvas dimensions based on the image size
      this.canvas.width = this.img.naturalWidth;
      this.canvas.height = this.img.naturalHeight;

      // Draw the image on the canvas
      this.ctx.drawImage(this.img, 0, 0);

      // Call the _setup and _draw methods to add the badge
      this._setup();
      this._draw();

      // Call the callback if provided
      if (callback) callback(this.dataURL);
    };

    this.img.src = this.src;
  }

  get dataURL() {
    return this.canvas.toDataURL();
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }
}
