
# node-google-static-maps

This is a PoC project to use Google Static Maps to dynamically load into pie files using ProtoPie Connect.

## How to run
1. Clone the project and navigate to the 'node-google-static-maps' directory
2. Build project **npm run build**
3. Start project **npm run start**

*Make sure to run ProtoPie Connect before running this bridge app*

## Configure the project

Update Google-Static-Maps KEY value in the src/index.ts file
- Follow [this link](https://developers.google.com/maps/documentation/maps-static/get-api-key) to obtain a key file

If you don't want to sign the API request make *DIGITAL_SIGNATURE = true* Update the Google-Static-Maps 'SECRET' value for digital signature in the src/index.ts file. By default DIGITAL_SIGNATURE is disabled. 
- Follow [this link](https://developers.google.com/maps/documentation/maps-static/digital-signature) for more information about digital signature

## How this app works

This app listens to SocketIO messages. When SocketIO message 'googleStaticMaps' is received, values associated with keys 'pieId', 'scene', 'container', 'image', 'api' are extracted to update the ProtoPie Connect Pie Model. Therefore SocketIO message value should be a JSON string.
#### Trigger SocketIO message
- googleStaticMaps
#### Trigger SocketIO value
{"pieId":"","scene":"","container":"","image":"","api":""}

- 'pieId' is the pieId of the pie running in ProtoPie Connect.
- 'scene' is the scene number where the Google Static Maps image is located at.
- 'container' is the container name the image is inside of. If the image is not inside a container leave this parameter blank. 
- 'image' is the image name Google Static Maps Image is loaded to
- 'api' is the URL of the Google Static Maps request. This URL should not contain the key and signature. To get to know how to make an api follow [this link](https://developers.google.com/maps/documentation/maps-static/start#URL_Parameters)

> {"pieId":"1", "scene":"1","container":"","image":"maps1","api":"https://maps.googleapis.com/maps/api/staticmap?size=640x360&scale=2&zoom=12&center=Seoul&format=png"}
- In this trigger value, pieId 1's image is dynamically loaded with the api URL. Image is located in scene 1, without a container and the image name is 'maps1'

> {"pieId":"1", "scene":"2","container":"Container 1","image":"maps2","api":"https://maps.googleapis.com/maps/api/staticmap?size=500x500&scale=2&zoom=12&center=Vancouver&format=png"}
- In this trigger value, pieId 1's image is dynamically loaded with the api URL. Image is located in scene 2, inside a container named 'Container 1', and the image name is 'maps2'

An example pie to test is [here](https://xid-ee.protopie.cloud/p/04d946f38f3465ac9e3e2e9d)