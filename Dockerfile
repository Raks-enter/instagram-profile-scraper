FROM apify/actor-node-playwright-chrome:20

# Set workdir
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the project
COPY . ./

# Command to run your actor
CMD ["node", "main.js"]
