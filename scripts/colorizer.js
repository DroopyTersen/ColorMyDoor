var Colorizer = function(imgId) {
  var self = this;
  self.imgElem = document.getElementById(imgId);
  self.canvas = document.createElement("canvas");
  self.ctx = self.canvas.getContext("2d");
  self.originalPixels = null;
  self.currentPixels = null;
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
  var dataLength = this.originalPixels.data.length;

  for (var i = 0; i < dataLength; i += 4) {
    if (this.currentPixels.data[i + 3] > 0) // If it's not a transparent pixel
    {
      this.currentPixels.data[i] = this.originalPixels.data[i] / 255 * newColor.R;
      this.currentPixels.data[i + 1] = this.originalPixels.data[i + 1] / 255 * newColor.G;
      this.currentPixels.data[i + 2] = this.originalPixels.data[i + 2] / 255 * newColor.B;
    }
  }

  this.ctx.putImageData(this.currentPixels, 0, 0);
  this.imgElem.src = this.canvas.toDataURL("image/png");
};

