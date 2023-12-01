 # Use an existing node alpine image as a base image.
FROM node:14-alpine3.15

# Set the working directory.
WORKDIR /reactapp
COPY public/ /reactapp/public
COPY src/ /reactapp/src
COPY package.json /reactapp/

# Install application dependencies.
#RUN npm install

RUN apk add python2 \
    make \
    g++ \
    && npm install


# Expose the port.
##EXPOSE 3000

# Run the application.
CMD ["npm", "start"]