<span align="center">
  
<h1>Website Screenshot</h1>
<h3>Preview generator for your online pages.</h3>

<p>
  
[![Build Status](https://travis-ci.org/jsulpis/website-screenshot.svg?branch=master)](https://travis-ci.org/jsulpis/website-screenshot)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=website-screenshot&metric=alert_status)](https://sonarcloud.io/dashboard?id=website-screenshot)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=website-screenshot&metric=coverage)](https://sonarcloud.io/dashboard?id=website-screenshot)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</p>

<a href="https://website-screenshot.vercel.app">
  <img class="repo-preview" src="https://raw.githubusercontent.com/jsulpis/website-screenshot/master/preview.png" alt="Screenshot image"/>
</a>

<p>Picture generated with this application.</p>

**Deploy your own copy of this project on Vercel in just a few clicks:**

[![Deploy](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/jsulpis/website-screenshot)

See the `Deployment` section for more information.

</span>

## Installation

Clone the repository and install the dependencies:

```shell
git clone https://github.com/jsulpis/website-screenshot.git && cd website-screenshot && yarn
```

The API url is made from the base url of the application, which is either defined in the environment variable `BASE_URL`, or `window.location` if the variable is not defined. For local development, I use the API already deployed on my dev environment, so I have `BASE_URL=https://website-screenshot.juliensulpis.now.sh` in a `.env` file in the `src` folder. You can (and are encouraged to!) deploy your own copy of the project and use your API instead.

## Usage

### Development

Serve with hot reload at localhost:3000.

```
yarn dev
```

### Build

If you want a JAMstack website: generate a fully static project with pre-rendered pages to put directly on a server or any hosting platform.

```
yarn generate
```

If you want to serve your website with SSR:

```
yarn build
yarn start
```

## Deployment

This template is ready to be deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/jsulpis/website-screenshot)

Here are the settings to use:

- Build Command: `yarn generate`
- Output Directory: `src/dist`
  Keep the other default values.

The environment variable `BASE_URL` is also used for the website url in the meta tags. If you deploy it and would like to have proper meta tags, you may want to set this environment variable on your platform.

## License

Released under the [MIT](https://github.com/jsulpis/website-screenshot/blob/master/LICENSE) license.
