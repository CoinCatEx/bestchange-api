# Bestchange api

![Licence](https://img.shields.io/npm/l/@nestjs/core.svg) 
![CI](https://github.com/coincatex/bestchange-api/workflows/CI/badge.svg) 
[![Docker](https://img.shields.io/docker/cloud/build/coincat/bestchange-api.svg)](https://hub.docker.com/r/coincat/bestchange-api)
[![Docker Registry](https://img.shields.io/docker/pulls/coincat/bestchange-api.svg)](https://hub.docker.com/r/coincat/bestchange-api)

> Easy to use Bestchange api HTTP server with first-class support for [Docker](#docker) 

Bestchange api server fetches latest rates from [Bestchange](https://bestchange.ru) continuously by certain time interval and provides easy to use REST api.
It is in production use at the [CoinCat](https://coincat.in) crypto exchange.

## Setup
#### Docker
See [Dockerfile](https://github.com/coincatex/bestchange-api/blob/master/Dockerfile) for image details.

Fetch the image (comes with latest stable NodeJS version)
```
docker pull coincat/bestchange-api
```

Start the container with optional flags (default listening on port 80)
```
docker run -p 80:80 coincat/bestchange-api
```

Enter to the interactive shell in a running container
```
sudo docker exec -it <containerIdOrName> bash
```

Stop the container
```
docker stop coincat/bestchange-api
```

You can see all the Docker tags [here](https://hub.docker.com/r/coincat/bestchange-api/tags/).

Alternatively you may add Bestchange-api to your `docker-compose.yml` file:

```yaml
version: "3"
services:
  api:
    image: coincat/bestchange-api:latest
    environment:
       WATCH_TIME_INTERVAL_MS: 100000
       API_URI: https://api-uri
    ports:
      - "80:80"
```
#### From Source
1. Clone repo
```
$ git clone git@github.com:CoinCatEx/bestchange-api.git
```
2. Install dependencies
```
$ npm install
```
3. Build
```
$ npm run build:prod
```
4. Run
```
$ npm run start:prod
```

## Configuration
You need to pass next environment variables in order to configure service: `WATCH_TIME_INTERVAL_MS` and `API_URI`.
In order to get API uri you may need to contact [Bestchange](https://bestchange.ru).

## Usage
There are only two endpoints:

returns all currencies available
```
/currencies
```

returns all rates for selected market direction
```
/?from=<CUR>&to=<CUR>
```

## Contributing

If you'd like to add additional information from API, feel free to file a pull request.
The best way to submit feedback and report bugs is to open a GitHub issue.

## Stay in touch
* Author - [CoinCat](https://coincat.in)
