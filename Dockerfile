FROM node:14.2-slim as builderNode
# Install Python.
RUN \
  apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get install -y python2.7 python-dev python-pip python-virtualenv && \
  apt-get install -y ssh git && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY ./package.json /usr/src

RUN npm config set unsafe-perm true
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
RUN npm install

COPY ./src /usr/src/src
COPY ./tsconfig-prod.json /usr/src/tsconfig-prod.json

RUN npm run build:prod


FROM node:14.2-slim as prodNode

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get install -y ssh git && \
  apt-get install -y aria2 && \
  apt-get install -y lbzip2 && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src
COPY --from=builderNode /usr/src/build /usr/src/build
COPY --from=builderNode /usr/src/package.json /usr/src
COPY --from=builderNode /usr/src/prod_node_modules /usr/src/node_modules
WORKDIR /usr/src

CMD ["npm", "run", "start:prod"]
