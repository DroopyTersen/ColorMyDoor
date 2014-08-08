var Colorizer = function(imgId) {
  var self = this;
  self.imgElem = document.getElementById(imgId);
  self.canvas = document.createElement("canvas");
  self.ctx = self.canvas.getContext("2d");
  self.originalPixels = null;
  self.currentPixels = null;
  self.imgElem.onload = function() {
    self.getPixels();
    self.ready.resolve();
  };
  self.ready = new $.Deferred();
};

Colorizer.prototype.getPixels = function() {
  var img = this.imgElem;
  this.canvas.width = img.width;
  this.canvas.height = img.height;

  this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
  this.originalPixels = this.ctx.getImageData(0, 0, img.width, img.height);
  this.currentPixels = this.ctx.getImageData(0, 0, img.width, img.height);

  img.onload = null;
};

Colorizer.prototype.hexToRgb = function(hex) {
  var long = parseInt(hex.replace(/^#/, ""), 16);
  return {
    R: (long >>> 16) & 0xff,
    G: (long >>> 8) & 0xff,
    B: long & 0xff
  };
};

Colorizer.prototype.changeColor = function(hex) {
  if (!this.originalPixels) return; // Check if image has loaded
  var newColor = this.hexToRgb(hex);

  for (var I = 0, L = this.originalPixels.data.length; I < L; I += 4) {
    if (this.currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
    {
      this.currentPixels.data[I] = this.originalPixels.data[I] / 255 * newColor.R;
      this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] / 255 * newColor.G;
      this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] / 255 * newColor.B;
    }
  }

  this.ctx.putImageData(this.currentPixels, 0, 0);
  this.imgElem.src = this.canvas.toDataURL("image/png");
};

