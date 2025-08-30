FROM apify/actor-node-playwright-chrome:20

# Switch to root to fix permissions
USER root

# Set workdir and fix ownership
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app && chown -R myuser:myuser /usr/src/app

# Copy package.json and install deps as myuser
COPY package*.json ./

USER myuser
RUN npm install --omit=dev

# Copy the rest of the app
COPY --chown=myuser:myuser . ./

# Start actor
CMD ["node", "main.js"]
