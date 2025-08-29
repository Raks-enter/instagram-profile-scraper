FROM apify/actor-node-playwright-chrome:20

# Copy everything into the container
COPY . ./

# Install dependencies
RUN npm install --omit=dev

# Start the actor
CMD ["node", "main.js"]
