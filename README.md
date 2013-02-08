# Quick Replace Bookmarklet

Quickly replace text or images in a webpage locally to see how it looks without knowing any HTML or having to upload files to a server.

[http://quick-replace.com/](http://quick-replace.com/)

## USAGE

* Click the bookmark to enable “edit mode”
* Roll over any element to see some useful info about the text or image it contains
* Click any text to edit it
* Drag an image from your local machine and drop it on top of an image in the browser to replace it
* Click the “X” in the upper-right of the viewport or the bookmark again to exit “edit mode”

## KNOWN ISSUES

* Dragging an image into the browser to replace an image will only work in browsers that support the File and FileReader API, like Chrome & Firefox
* Dragging an image into the browser to replace an image will only work with images displayed as an img element - not as a CSS background-image or a canvas element
* Replaced images will be shown at the same dimensions as specified by the original image (via img attributes or CSS styles)
* Chrome will prevent the script, which is insecure (served over HTTP), from being loaded into a secure page (served via HTTPS)

## TO DO

* _To follow..._

## ABOUT

This is a simple tool, built quickly to solve a specific use case I encountered. It's not meant to solve all problems for everyone, but I am happy to share it as a reference or starting point for similar applications.

Lucas J. Shuman  
[http://lucasishuman.com](http://lucasishuman.com)
