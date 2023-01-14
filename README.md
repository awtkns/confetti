![Confetti](https://github.com/awtkns/confetti/blob/main/public/banner.png)

<p align="center">
  <em>🥳 Get your estimation party started with confetti 🥳</em></br>
  <sub>Realtime estimation with confetti-filled fun. The party tool for your planning process.</sub>
</p>
<p align="center">
 <a href="https://confetti.dev/" target="_blank">
  <img alt="Deployment Success" src="https://img.shields.io/github/deployments/awtkns/confetti/production?color=2334D058&label=Deployment" />
 </a>
 <img alt="Health Check" src="https://img.shields.io/github/actions/workflow/status/awtkns/confetti/healthcheck.yml?label=Health%20Check&color=2334D058" />
 <img alt="License" src="https://img.shields.io/github/license/awtkns/confetti?color=2334D058" />
 <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=16.0.0&logo=node.js&color=2334D058" />
</p>

<p align="center">
<a href="https://confetti.dev">🔗 Short link</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#-getting-started">🤝 Contribute</a>
</p>

---

Are you tired of mundane planning sessions? It's time to get the party started with 
<a href="https://confetti.dev/" target="_blank">confetti.dev</a>! Confetti brings a burst of color and excitement 
to your fibonacci process. Whether you're working with a large or small team, or just looking for a more 
engaging way to plan projects, confetti has got you covered. So why just estimate when you can celebrimate?

## 🎉 Features
 - 🎨 **Colorful** - Confetti will rain down when all estimates agree.
 - 📈 **Realtime** - See your team's estimates update in realtime.
 - 📝 **Collaborative** - Share your session with your whole team, small or large.
 - 📊 **Estimation** - Confetti supports currently fibonacci estimates, more coming soon!
 - 🔓 **Anonymous** - No need to create an account. Just enter a username, and you're ready to go.
 - 🔒 **Secure** - Login with your favorite SSO provider. When logged in, your profile image will be shown in the session.
 - 📦 **Open-source** - Confetti is free and open-source.

## 🚀 Tech Stack

- ✅ **Bootstrapping**: [create-t3-app](https://create.t3.gg).
- ✅ **Framework**: [Nextjs 13 + Typescript](https://nextjs.org/).
- ✅ **Auth**: [Next-Auth.js](https://next-auth.js.org)
- ✅ **ORM**: [Prisma](https://prisma.io).
- ✅ **Database**: [Planetscale](https://planetscale.com/).
- ✅ **Realtime**: [Supabase](https://supabase.com/).
- ✅ **Styling**: [TailwindCSS + HeadlessUI](https://tailwindcss.com).
- ✅ **Typescript Schema Validation**: [Zod](https://github.com/colinhacks/zod).
- ✅ **End-to-end typesafe API**: [tRPC](https://trpc.io/).

## 👨‍🚀 Getting Started

> 🚧 You will need [Nodejs +16 (LTS recommended)](https://nodejs.org/en/) installed.

1. Fork this project:

- [Click here](https://github.com/awtkns/confetti/fork).

2. Clone the repository:

```bash
git clone git@github.com:YOU_USER/confetti.git
```

3. Install dependencies:

```bash
npm install
```

4. Create a **.env** file with the following content:

> 🚧 The environment variables must match the following [schema](https://github.com/awtkns/confetti/blob/main/src/env/schema.mjs#L8).

```bash
# Next Auth Secrets
NODE_ENV=production
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# OAuth secrets:
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Next Auth config:
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Database URLs:
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

5. Ready 🥳, now run:

```bash
# Create database migrations
npx prisma db push

# Run the project:
npm run dev
```
