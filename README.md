### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy-production`

Builds and deploys the app to https://gyrosynth.ianabildskou.now.sh

### `npm run deploy-staging`

Builds and deploys the app to https://gyrosynthstaging.ianabildskou.now.sh

## Setting up tunneling

To test on your phone from your local build you can set up a tunnel to your desktop
Install `localtunnel` with

#### `npm install -g localtunnel`

Then run the tunnel with

#### `npm run tunnel`

You can then go to https://gyrosynth.localtunnel.me
You need to be using port 3000.
