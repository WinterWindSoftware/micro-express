FROM debian:jessie

# Create nginx user
RUN groupadd -r nginx && useradd -r -g nginx nginx

#apt-get base installs
RUN echo "deb http://nginx.org/packages/debian/ wheezy nginx" >> /etc/apt/sources.list.d/nginx.list \
    && apt-key adv --fetch-keys "http://nginx.org/keys/nginx_signing.key" \
    && apt-get update \
    && apt-get install -y --force-yes --no-install-recommends \
    apt-transport-https \
    build-essential \
    curl \
    ca-certificates \
    git \
    lsb-release \
    nginx \
    python-all \
    python-pip \
    rlwrap \
    supervisor \
    && pip install supervisor-stdout \
    && rm -rf /var/lib/apt/lists/*;

#install node & gulp
RUN curl https://deb.nodesource.com/node_0.12/pool/main/n/nodejs/nodejs_0.12.4-1nodesource1~jessie1_amd64.deb > node.deb \
    && dpkg -i node.deb \
    && rm node.deb \
    && npm install gulp -g

# nginx config
RUN rm -Rf /etc/nginx/conf.d/* \
    && mkdir -p /etc/nginx/sites-available/ \
    && mkdir -p /etc/nginx/sites-enabled/ \
    && rm -Rf /etc/nginx/nginx.conf \
    && rm -f /etc/nginx/sites-enabled/default
COPY ./docker/nginx.conf /etc/nginx/
COPY ./docker/app-nginx.conf /etc/nginx/sites-enabled/

# Create folders for source files and logs
RUN mkdir -p /usr/src/app \
    && chmod 777 /usr/src/app \
    && mkdir -p /var/log/node/

# Set Node Environment (this can be overriden by docker run -e parameter)
ENV NODE_ENV production

# Copy across source files
WORKDIR /usr/src/app
# First just add package.json  (so docker can cache node_modules in intermediate container)
COPY ./package.json ./
RUN npm --production=false install

# COPY rest of folders/files
COPY . ./

RUN gulp build

# Supervisor Config and  startup script
COPY ./docker/supervisord.conf /etc/supervisord.conf
COPY ./docker/start.sh /start.sh
RUN chmod 755 /start.sh

# Ports
EXPOSE 80

CMD ["/bin/bash", "/start.sh"]
