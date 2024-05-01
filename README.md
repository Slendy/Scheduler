# Scheduler

An open source service for scheduling events and publishing live countdowns.

## Disclaimer
> [!WARNING]
> This application is still in development, and is not currently meant to be used in production environments due to unimplemented security and instability. 
> The database schema is also not final and subject to change at any time.


## Development

### Requirements

The recommended IDE for development is VSCode.

This project is made in SvelteKit and requires the Bun runtime to be installed. To install Bun, follow the instructions located on their [`website`](https://bun.sh)

### Running locally

First begin by cloning the repository
```bash
git clone https://github.com/Slendy/Scheduler
```
Next, install the required dependencies
```bash
bun install
```

The application requires a MongoDB database which is configured by setting the `MONGO_URL` environment variable or by creating a `.env.development` file.

To run the development server use the preconfigured build task or type
```bash
bun --bun run dev
```
The app will be available at `http://localhost:5173` and any changes you make to the code or markup will be hot reloaded. Note that if you make changes to the database models the application must be restarted due to how they are compiled by mongoose.

## Deployment
### Building manually
To compile the project run:
```bash
bun run build
```
The resulting build output will be stored in the `/build` folder and can be ran with:
```bash
bun run start
```

### Using Docker
To run this project using Docker, you can use the example [`compose.yml`](https://github.com/Slendy/Scheduler/compose.yml) to build your own image or optionally use the premade Docker image with 
```bash
docker pull ghcr.io/slendy/scheduler:main
``` 
If you decide to run Scheduler with a reverse proxy like Nginx you will need to forward the origin header to the server, otherwise things like form submissions won't function.
```
proxy_set_header Origin https://$host;
```

You will also need to set the `ORIGIN` environment variable in the Scheduler container with the same url as your reverse proxy domain, including any protocols and ports.

For example, if your website was running on `https://prod.example.com` you would need to set the origin environment variable like so:
```
ORIGIN=https://prod.example.com:443
```