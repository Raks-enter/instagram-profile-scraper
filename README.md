# Instagram Profile Scraper

Scrape Instagram profiles easily by providing one or more usernames.

## Features
- Extract number of followers and follows
- Get profile URL and bio
- Scrape recent posts (URLs, captions, likes, comments count)
- Find related profiles
- Extract highlight reels

## Input
- **usernames**: Array of Instagram usernames (without @).
- **maxPosts**: Maximum number of posts to scrape per profile.

Example input:
```json
{
  "usernames": ["cristiano", "natgeo"],
  "maxPosts": 5
}
```

## Output
Each dataset item contains:
- username
- profileUrl
- followersCount
- followsCount
- bio
- posts (list with postUrl, caption, likesCount, commentsCount)
- relatedProfiles
- highlightReel
