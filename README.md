![Estimator](https://github.com/awtkns/estimator/blob/main/public/banner.png)

<p align="center">
  <em>🥳 Estimate tickets with more confetti</em> 🥳</br>
  <sub>A realtime sprint estimation tool with 100% more confetti</sub>
</p>
<p align="center">
 <a href="https://estimator.awtkns.com/" target="_blank">
  <img alt="Deployment Success" src="https://img.shields.io/github/deployments/awtkns/estimator/production?color=2334D058&label=Deployment" />
 </a>
 <img alt="License" src="https://img.shields.io/github/license/awtkns/estimator?color=2334D058" />
    <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=16.0.0&logo=node.js&color=2334D058" />
</p>


---

**Documentation**: <a href="https://estimator.awtkns.com/" target="_blank">https://estimator.awtkns.com</a>

**Source Code**: <a href="https://github.com/awtkns/estimator" target="_blank">https://github.com/awtkns/estimator</a>

---

Welcome to the Sprint Estimator 2.0 - the ultimate tool for figuring out how long it will take to complete 
your next sprint... or at least get really close!

Are you tired of constantly overestimating the amount of work that needs to be done in a sprint? 
Well, fear not because the Sprint Estimator 2.0 has got you covered.

With our revolutionary Fibonacci-based estimation system, you and your team can now accurately predict 
how long it will take to complete each task. Simply input your tickets, let the magic of the Fibonacci sequence 
do its thing, and voila! You'll have a pretty good idea of how long it will take to get everything done.

But that's not all! The Sprint Estimator 2.0 also comes with a real-time leaderboard, 
so you can see who on your team is the most optimistic (or realistic) estimator. And, drum roll please... 
the feature you've all been waiting for: CONFETTI! Yes, that's right, whenever someone accurately 
estimates a ticket, the Sprint Estimator 2.0 will shower them with virtual confetti. 
It's like a little party in your browser!

So why wait? Start estimating like a pro with the Sprint Estimator 2.0 today!

---

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

- [Click here](https://github.com/awtkns/estimator/fork).

2. Clone the repository:

```bash
git clone git@github.com:YOU_USER/estimator.git
```

3. Install dependencies:

```bash
npm install
```

4. Create a **.env** file with the following content:

> 🚧 The environment variables must match the following [schema](https://github.com/awtkns/estimator/blob/main/src/env/schema.mjs#L8).

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

