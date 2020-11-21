# GetPaper

GetPaper is an angular application with ionic framework. It uses a firebase database and firebase functions. Written in typescript it integrates shopify, stripe payments and shipstation.

## Prerequisite
NodeJs version and npm package, firebase account, shopify app

## Install depedencies
```shell
npm install -g ionic
npm install -g cordova
npm rebuild node-sass
npm install
```

## Test locally:
```shell
ionic serve
```

## Deploy function on google Firebase
```shell
firebase deploy --only functions
```

## Test function locally in function directory
```shell
firebase serve --only functions
```

Make sure node is using development mode!
export NODE_ENV=devlopment



## Build and deploy to prod
can try: ionic build --prod
```shell
ng build
firebase deploy
```

Make sure node is using production mode!
export NODE_ENV=production


## Testing install of shopify app
Run ngrok http 5000 when function are running locally `ngrok http 5000`

Get the local ngrok address and modify dev.env file forwarding address
Shopify needs to be updated as well to have this new adress whitelisted.
More details about shopify app configuration [here](https://github.com/MartinBeeyouriot/shopify-app-simple-server).
