# Dash V2

Web-based dashboard containing a variety of visualizations and
interactive elements for personal data tracking, analysis and
monitoring.

https://github.com/user-attachments/assets/0c0d96d9-9fa2-449c-8456-6db878186ada

This is an improved version of one of my archived projects from
2021 when I was relatively new to NextJS. The original repositories
can be found at the links below:  

- [dash-frontend](https://github.com/mufasa159/dash-frontend)
- [dash-backend](https://github.com/mufasa159/dash-backend)



## Table of Contents

- [Project Structure](#project-structure)
- [Local Environment Setup](#local-environment-setup)
- [License](#license)



## Project Structure

Dash V2 is built using [NextJS](https://nextjs.org/) with
[PostgreSQL](https://www.postgresql.org/), and containerized using
[Docker](https://www.docker.com/). 


- The `app` directory contains all the routes for the application,
including the REST API endpoints.

- Configuration files for the project can be found in `lib/config.ts`
file.  

- All the reusable client-side components are stored in the
`components` directory.

- The schema files for the database is stored in the `database`
directory. since it's a relatively small project and I wanted to avoid
unnecessary dependencies,the migration files are generated manually.
Ideally they'd be generated automatically through tools like
[Prisma](https://www.prisma.io/).



## Local Environment Setup

The project comes with a `docker-compose.yml` file that sets up the
development environment for the project. To get started, you need to
have Docker installed on your machine. You can download Docker from
the [official website](https://www.docker.com/).

In the project root directory, create a `.env` file and copy the
contents of the `.env.example` file into it. Then, update the values
of the environment variables in the `.env` file based on the table
below:

| Variable                | Description |
| ----------------------- | ----------- |
| `PG_*`                  | Leave as-is unless using an external database outside Docker. |
| `NEWS_API_KEY`          | Register at [NewsAPI](https://newsapi.org/register) and copy your API key |
| `TSS_QUOTE_API_KEY`     | Register at [TheySaidSo](https://theysaidso.com/register) and copy your Quote API key |
| `SPOTIFY_CLIENT_ID`     | Create an app on [Spotify for Developers](https://developer.spotify.com/dashboard/), then copy the `Client ID` from the app's settings. |
| `SPOTIFY_CLIENT_SECRET` | Retrieve the `Client Secret` from your app on [Spotify for Developers](https://developer.spotify.com/dashboard/). |
| `NEXTAUTH_SECRET`       | Generate a random string and use it as the secret for NextAuth | 


Run the following command to start the development environment:

```bash
docker-compose up --build
```

The project will be available at http://localhost:3000



## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.
