# Carrot Market LA

Carrot Market is an existing service in Korea. Inspired by Carrot Market, I wanted to create used items sales platform among Korean community as Koreans in LA have limited options such as KakaoTalk Open chat, RadioKorea, or MissyUSA.

## Features

- No need to create an account to use
- Only need to create a temporary account when creating a sell post
- Only recent and active posts shown as every post is automatically deleted after 1 week
- User accounts with no active posts are automatically deleted
- Original poster can extend their post for another week if desired
- Multiple items could be posted on one post with a nice carousel view
- Automatic image resizing for faster image upload and view

## Features to be supported

- Search and filter functionality based on price range, seller's location, and item name.
- User dashboard to manage their post
- Responsive UI for mobile-friendly

### Features to be supported if desired

- Account system
- Direct messaging
- Rating sellers/buyers

### Why are some features not supported like real Carrot Market?

For ease of usage, I decided to not implement user account feature. Due to lack of accounts, direct messaging or rating the seller/buyer couldn't be implemented. This is the main difference between Carror Market and Carrot Market LA. There are a lot of Koreans who moved from Korea or going back to Korea, and those will only use this service for a limited time. Thus, I believe creating account will be a hassle for those users.

## Local testing

When you are locally testing, first run Prisma and development server:

```bash
npx prisma studio
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Open [http://localhost:5555](http://localhost:5555) with your browser to see the database.
