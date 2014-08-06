var colorizer = (function() {
  var door = document.getElementById("door");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var originalPixels = null;
  var currentPixels = null;

  function getPixels() {
    var img = door;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    originalPixels = ctx.getImageData(0, 0, img.width, img.height);
    currentPixels = ctx.getImageData(0, 0, img.width, img.height);

    img.onload = null;
  }

  var hexToRgb = function(hex) {
    var long = parseInt(hex.replace(/^#/, ""), 16);
    return {
      R: (long >>> 16) & 0xff,
      G: (long >>> 8) & 0xff,
      B: long & 0xff
    };
  };

  var changeColor = function(hex) {
    if (!originalPixels) return; // Check if image has loaded
    var newColor = hexToRgb(hex);

    for (var I = 0, L = originalPixels.data.length; I < L; I += 4) {
      if (currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
      {
        currentPixels.data[I] = originalPixels.data[I] / 255 * newColor.R;
        currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * newColor.G;
        currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * newColor.B;
      }
    }

    ctx.putImageData(currentPixels, 0, 0);
    door.src = canvas.toDataURL("image/png");
  };

  return {
    hexToRgb: hexToRgb,
    changeColor: changeColor,
    getPixels: getPixels
  };
})();
