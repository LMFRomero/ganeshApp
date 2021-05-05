FROM node:15

# Select the docker app file
WORKDIR /usr/src/app

# Copying frontend files
COPY . .

# Install Application
RUN npm install && \
    npm run build && \
    npm install -g serve

# Expose front-end default port
EXPOSE 3000

# Serve front-end in 3000 port
CMD serve -s build -l 3000