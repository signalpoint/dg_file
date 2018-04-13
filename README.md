# dg_file

The File module for DrupalGap 8. Provides support for an `file` input element on forms.

## Web App

When using this module with a web app, it should just work with modern browsers, no dependencies are required.

## Cordova

When using this module with Cordova, the following plugins are required:

```
cordova-plugin-file
cordova-plugin-camera
```

# Usage

On a DrupalGap 8 form, try something like this:

```
form.mugshot = {
  _type: 'file',
  _title: dg.t('Mugshot'),
  _required: true
};
```

## Options

Additional options that can be passed along with the widget:

### _filePathDir

A directory within the Drupal files directory to save the file in, for example:

```
_filePathDir: 'articles/images'
```

This would save the file into the `sites/default/files/articles/images` folder.
