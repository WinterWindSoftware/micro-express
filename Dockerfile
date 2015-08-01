FROM ubuntu:trusty

# Set Node Environment (this can be overriden by docker run -e parameter)
ENV NODE_ENV production

# Create nginx user
RUN groupadd -r nginx && useradd -r -g nginx nginx

#apt-get installs
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install -y \
        build-essential \
        curl \
        git \
        pwgen \
        python-setuptools \
        rlwrap \
        software-properties-common \
        wget && \
        add-apt-repository -y ppa:nginx/stable && \
        apt-get update && \
        apt-get install -y nginx && \
        rm -r /var/lib/apt/lists/*

# Install Node and Gulp
# (from Node v0.12's recommend instructions: https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories)
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get install -y nodejs && \
    npm install gulp -g

# Supervisor Config
RUN /usr/bin/easy_install supervisor && \
    /usr/bin/easy_install supervisor-stdout
ADD ./docker/supervisord.conf /etc/supervisord.conf

# nginx config
RUN rm -Rf /etc/nginx/conf.d/* && \
    mkdir -p /etc/nginx/sites-available/ && \
    mkdir -p /etc/nginx/sites-enabled/ && \
    rm -Rf /etc/nginx/nginx.conf && \
    rm -f /etc/nginx/sites-enabled/default
COPY ./docker/nginx.conf /etc/nginx/
COPY ./docker/portal-nginx.conf /etc/nginx/sites-enabled/

# Create folders for source files and logs
RUN mkdir -p /usr/share/rewind-portal && \
    chmod 777 /usr/share/rewind-portal && \
    mkdir -p /usr/share/rewind-portal/build/dev/logs && \
    chmod 777 /usr/share/rewind-portal/build/dev/logs && \
    mkdir -p /var/log/node/

# Copy across source files
WORKDIR /usr/share/rewind-portal
# First just add package.json and bower.json (so docker can cache node_modules in intermediate container)
COPY ./package.json ./
RUN npm --production=false install
COPY ./bower.json ./
COPY ./.bowerrc ./
RUN mkdir ./client/ && \
    bower install --config.interactive=false --allow-root

# COPY rest of folders/files
COPY . ./

RUN gulp build

# Copy Supervisord startup script
COPY ./docker/start.sh /start.sh
RUN chmod 755 /start.sh

# Expose Ports
EXPOSE 5000
EXPOSE 80

CMD ["/bin/bash", "/start.sh"]
