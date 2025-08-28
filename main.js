import { Actor } from "apify";
import { PlaywrightCrawler } from "crawlee";

await Actor.init();

const input = await Actor.getInput();
const { usernames, maxPosts } = input;

const results = [];

const crawler = new PlaywrightCrawler({
    maxConcurrency: 2,
    launchContext: {
        launchOptions: {
            headless: true,
        },
    },
    requestHandler: async ({ page, request }) => {
        const username = request.userData.username;

        await page.waitForSelector("header", { timeout: 15000 });

        const profileData = await page.evaluate((maxPosts) => {
            const formatNumber = (text) => {
                if (!text) return 0;
                text = text.replace(/,/g, "");
                if (text.includes("k")) return Math.round(parseFloat(text) * 1000);
                if (text.includes("m")) return Math.round(parseFloat(text) * 1000000);
                return parseInt(text, 10) || 0;
            };

            const followersText = document.querySelector("header li:nth-child(2) a span")?.getAttribute("title") ||
                                  document.querySelector("header li:nth-child(2) span")?.textContent;
            const followsText = document.querySelector("header li:nth-child(3) a span")?.textContent;

            const posts = [];
            const nodes = document.querySelectorAll("article a");
            nodes.forEach((node, i) => {
                if (i < maxPosts) {
                    const caption = node.querySelector("img")?.getAttribute("alt") || "";
                    const postUrl = node.href;
                    posts.push({
                        postUrl,
                        caption,
                        likesCount: null,   // IG hides likes often
                        commentsCount: null // needs deeper navigation
                    });
                }
            });

            const bio = document.querySelector("header section div:nth-of-type(3)")?.innerText || "";

            return {
                followersCount: formatNumber(followersText),
                followsCount: formatNumber(followsText),
                bio,
                posts,
                relatedProfiles: [], // IG hides behind login
                highlightReel: Array.from(document.querySelectorAll("section ul li div span")).map(x => x.textContent)
            };
        }, maxPosts || 5);

        const item = {
            username,
            profileUrl: `https://www.instagram.com/${username}/`,
            ...profileData
        };

        results.push(item);
        await Actor.pushData(item);
    },
});

for (const username of usernames) {
    await crawler.addRequests([
        { url: `https://www.instagram.com/${username}/`, userData: { username } },
    ]);
}

await crawler.run();
await Actor.exit();
