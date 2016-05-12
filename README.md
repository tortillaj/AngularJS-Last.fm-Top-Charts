# AngularJS-Last.fm-Top-Charts

Content from Last.fm showing top artist charts. Anyone is welcome to use this in any way they want.

The Last.fm API is rate limited, so this project caches requests for 5 minutes in local storage (should your browser support it). This caching is provided by Mozilla's [localForage](https://github.com/mozilla/localforage).

The top chart data from Last.fm is paginated, and you can select a per-page limit and click through pages of artists. Additionally, more information is queried about each artist, like their taggings, similar artists, and bio.

## Development

After cloning, simply `npm install` in order to install all the npm packages and bower packages. A post install hook runs automatically to compile assets.

Next, use the provided gulp tasks to build and develop as you please. Simply running `gulp` will compile the project, open it in your browser, and live reload for development.
