/**
 *
 * @param variables
 * @returns {string}
 */
dg.theme_file_input = function(variables) {
  //console.log('theme_file_input', variables);

  // Create a new file input, set it aside for use down the line and then return its html.
  var fileInput = new DgFileInput(variables);
  dg_file.setFileInput(fileInput);
  return fileInput.html();

};

//dg_file.chooseFileOnchange = function(wrapperId, inputId, previewId, formInputId) { // web-app only...
dg_file.chooseFileOnchange = function(fileInputId) { // web-app only...
  //console.log('chooseFileOnchange', arguments);

  // Load up the file input's variables.
  var fileInput = dg_file.getFileInput(fileInputId);
  //console.log('fileInput', fileInput);

  var input = fileInput.getInput();
  //console.log('input', input);

  // Grab the file from the file input element.
  //var file = document.querySelector('#' + inputId).files[0];
  var file = input.files[0];
  if (!file) { return; }
  //console.log('file input', file);

  // Init a file reader.
  var reader = new FileReader();

  // Step 2: Get ready for when the file is loaded...
  reader.addEventListener("load", function () {

    // The file has been loaded...

    //dg_file.loaded(file, reader.result, inputId, previewId, formInputId);
    dg_file.loaded(file, reader.result, fileInputId);

  }, false);

  // Step 1: Load the file chosen by the user and circle back to the "load" event listener.
  if (file) { reader.readAsDataURL(file); }

};


dg_file.openFilePicker = function(button, previewId, formInputId) { // compiled app only...
  //console.log('openFilePicker', arguments);

  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  var options = dg_file.setOptions(srcType);

  navigator.camera.getPicture(function cameraSuccess(imageUri) {
    window.resolveLocalFileSystemURI(imageUri,
        function(fileEntry) {

          //console.log(fileEntry.fullPath);
          //console.log(fileEntry);

          // The file has been loaded...
          fileEntry.file(function(file) {

            dg_file.loaded(file, imageUri, button.getAttribute('id'), previewId, formInputId);

          });

          // @see https://www.npmjs.com/package/cordova-plugin-file#read-a-file
          //fileEntry.file(function (file) {
          //  var reader = new FileReader();
          //
          //  reader.onloadend = function() {
          //    console.log("Successful file read: " + this.result);
          //    //displayFileData(fileEntry.fullPath + ": " + this.result);
          //
          //
          //
          //  };
          //
          //  reader.readAsText(file);
          //
          //}, onErrorReadFile);

        },
        function() {
          //error
        }
    );
  }, function cameraError(error) {

    console.debug("Unable to obtain picture: " + error, "app");

  }, options);

};


dg_file.widgetRemoveOnclick = function(button) {
  var fid = button.getAttribute('data-fid');
  var error = function(xhr, status, msg) { dg.alert(msg); };
  file_delete(fid, {
    success: function(result) {
      console.log(result);
      if (result[0]) {

        // @TODO need to remove preview and start the widget/element over for a new file
        // @TODO clear out the hidden input value.

      }
      else { error(null, null, dg.t('There was a problem removing the file.')); }
    },
    error: error
  });
};
