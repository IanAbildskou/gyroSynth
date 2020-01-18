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

## Setting up now

Download the now CLI `npm i -g now`

Get invite for the now project team from admin

Run `npm login your@email.com`

### `npm run deploy-production`

Builds and deploys the app to https://gyrosynth.ianabildskou.now.sh

### `npm run deploy-staging`

Builds and deploys the app to https://gyrosynthstaging.ianabildskou.now.sh

## Setting up tunneling

Download the ngrok client from here https://dashboard.ngrok.com/get-started

unpack it and put the .exe/.dmg file in the same directory as your gyroSynth project
So that they are next to each other. Don't put the executable inside the gyrosynth project.

First time setup you should also put an auth token in your ngrok instance like this:

`authtoken somAuthToken`

I can get you the auth token from my ngrok dashboard

After you've done all that you can run the tunnel from inside the gyroSynth repo with:

`npm run tunnel`

If someone is already using that subdomain you can pick another one
