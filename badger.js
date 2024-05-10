/**
 * Add notification badge (pill) to favicon in browser tab
 * @url stackoverflow.com/questions/65719387/
 */
class Badger {
    constructor(options) {
      Object.assign(
        this,
        {
          backgroundColor: "#f00",
          color: "#fff",
          size: 0.6, // 0..1 (Scale in respect to the favicon image size)
          position: "ne", // Position inside favicon "n", "e", "s", "w", "ne", "nw", "se", "sw"
          radius: 8, // Border radius
          src: "", // Favicon source (dafaults to the <link> icon href)
          onChange() {},
        },
        options
      );
      this.faviconEL = document.querySelector("link[rel*=icon]"); // Initialize faviconEL in the constructor
      if (!this.faviconEL){
        console.log("No favicon element found. Creating one now.");
        this.faviconEL = document.createElement('link');
        this.faviconEL.rel = 'icon';
        this.faviconEL.href = '';
        document.getElementsByTagName('head')[0].appendChild(this.faviconEL);
      }      
      this.canvas = document.createElement("canvas");
      this.src = this.src;// || this.faviconEL.getAttribute("href");
      this.ctx = this.canvas.getContext("2d");
      
    }
    
    faviconEL; // Declare faviconEL property

  
    _drawIcon() {
      this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize);
      this.ctx.drawImage(this.img, 0, 0, this.faviconSize, this.faviconSize);
    }

    _drawShapeBgr() {
      const r = this.radius+1;
      const xa = this.offset.x-1;
      const ya = this.offset.y-1;
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

    _drawShape() {
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
  
    _drawVal() {
      const margin = (this.badgeSize * 0.18) / 2;
      this.ctx.beginPath();
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.font = `bold ${this.badgeSize * 0.82}px Arial`;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(
        this.value,
        this.badgeSize / 2 + this.offset.x,
        this.badgeSize / 2 + this.offset.y + margin
      );
      this.ctx.closePath();
    }
  
    _drawFavicon() {
      console.log("drawing favicon");
      this.faviconEL.setAttribute("href", this.dataURL);
    }
  
    _draw() {
      console.log("drawing");      
      this._drawIcon();
      if (this.value) this._drawShapeBgr();
      //if (this.value) this._drawShape();
      if (this.value) this._drawVal();
      this._drawFavicon();
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
  
    update() {
      console.log("updating");
      //this._value = Math.min(99, parseInt(this._value, 10));
      if (this.img) {
        this._draw();
        if (this.onChange) this.onChange.call(this);
      } else {
        this.img = new Image();
        this.img.addEventListener("load", () => {
          this._setup();
          this._draw();
          if (this.onChange) this.onChange.call(this);
        });
        this.img.src = this.src;
      }
    }
  
    get dataURL() {
      return this.canvas.toDataURL();
    }
  
    get value() {
      return this._value;
    }
  
    set value(val) {
      this._value = val;
      this.update();
    }
  }