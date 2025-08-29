# Use Apify's Playwright image with Chrome preinstalled
FROM apify/actor-node-playwright-chrome:20

# Copy everything to the image
COPY . ./

# Install only production dependencies
RUN npm install --omit=dev

# Start the actor
CMD ["node", "main.js"]
