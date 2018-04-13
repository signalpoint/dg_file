// @todo camera.cleanup() for iOS: https://github.com/apache/cordova-plugin-camera#cameracleanup

dg_file.setOptions = function (srcType) {
  return {
    quality: 100,
    destinationType: Camera.DestinationType.FILE_URI, // imageUri
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    //mediaType: window.Camera.MediaType.ALLMEDIA,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true  //Corrects Android orientation quirks
  };
};

/**
 * Get a base64 encoded version of the file.
 * @param imageUri
 * @returns {string}
 */
dg_file.encodeImageUri = function(imageUri) {
  return new Promise(function(ok, err) {
console.log('encoding ', imageUri);
    // @see https://stackoverflow.com/a/11246772/763010
    var c=document.createElement('canvas');
    var ctx=c.getContext("2d");
    var img=new Image();
    img.onload = function(){
      c.width=this.width;
      c.height=this.height;
      ctx.drawImage(img, 0,0);
      console.log('resolving');
      ok(c.toDataURL("image/jpeg")); // @TODO is what about incoming png?
    };
    img.src = imageUri;
  });
};