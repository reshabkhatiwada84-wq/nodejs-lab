# Lab 08 – Integrated Node.js Lab Server

## 1. Introduction

Lab 08 is an integrated Node.js web server project that brings together the practical work completed in Labs 01 to 07. It provides a single web portal where users can explore lab details, view JavaScript source code, execute scripts, access server-based applications, and view screenshots of lab outputs.

The project is developed using Node.js and its built-in modules, along with the `slugify` package.

## 2. Objectives

- To integrate Labs 01–07 into one Node.js server.
- To display lab details and JavaScript source code through a web interface.
- To execute script-based labs from the portal.
- To provide access to server-based lab applications.
- To maintain request logs using the EventEmitter module.
- To display lab screenshots and dashboard information.
- To prepare the application for local and cloud deployment.

## 3. Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **HTTP module:** Handles incoming requests and responses.
- **File System (fs):** Reads source files, screenshots, and log files.
- **Path module:** Manages file and directory paths.
- **EventEmitter:** Handles request logging events.
- **Slugify:** Utility package included in the project dependencies.
- **HTML and CSS:** Used to display the web portal.

## 4. Project Structure

```text
NodeJS-Lab/
├── Lab-01/
├── Lab-2/
├── Lab-3/
├── Lab-4/
├── Lab-05/
├── Lab-06/
├── Lab-07/
└── Lab-08/
    ├── modules/
    │   └── logger.js
    ├── public/
    │   └── screenshots/
    ├── logs/
    ├── build-labs.js
    ├── labs.js
    ├── server.js
    ├── package.json
    ├── package-lock.json
    └── .gitignore
```

The `build-labs.js` file generates the lab registry, `server.js` handles requests, and `logger.js` manages request logging. The screenshots directory stores the lab output images.

## 5. Features

1. **Integrated Portal:** Access Labs 01–07 from one server.
2. **Lab Details:** View lab descriptions, files, and screenshots.
3. **Source Code Viewer:** Open JavaScript source code through the browser.
4. **Script Execution:** Execute supported script-based labs from the portal.
5. **Server Applications:** Access the integrated versions of the HTTP server, Student Directory, and Advanced Server labs.
6. **Request Logging:** Record HTTP requests with timestamps.
7. **Dashboard API:** View lab statistics, screenshot counts, and request-log information.
8. **Screenshot Gallery:** Display practical output screenshots for available labs.
9. **Health Check:** Check whether the server is responding.
10. **Deployment Support:** Use an environment-based port for hosting platforms.

## 6. Installation and Execution

### Requirements

- Node.js installed on the system.
- npm installed with Node.js.
- Git (optional, for version control).

### Step 1: Open the project directory

```bash
cd Lab-08
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Generate the lab registry

```bash
npm run build
```

### Step 4: Start the server

```bash
npm start
```

### Step 5: Open the portal

Open the following URL in your browser:

`http://localhost:3000`

The application uses the configured port or the hosting platform's `PORT` environment variable.

## 7. Important Routes

| Route | Purpose |
|---|---|
| `/` | Opens the home portal |
| `/about` | Displays project information |
| `/health` | Checks server availability |
| `/labs` | Lists available labs |
| `/labs/03` | Displays Lab 03 details |
| `/labs/03/run` | Executes a supported script-based lab |
| `/labs/03/app/students` | Opens the integrated Student Directory route |
| `/api/dashboard` | Returns dashboard statistics |
| `/screenshots/Lab-2-server-running.png` | Displays an available screenshot |

Replace the lab ID and screenshot filename with the appropriate values when accessing other labs. The `/run` route is intended for script-based labs, while `/app/...` is intended for supported server-based labs.

## 8. Request Logging

The project uses Node.js EventEmitter to generate request events. The logger records the HTTP method, requested URL, and timestamp.

Log entries are stored in:

`Lab-08/logs/server.log`

The `logs/` directory is excluded from Git tracking because it contains generated runtime data.

## 9. Screenshots

The project includes a screenshot gallery for available lab outputs. Images are stored in:

`Lab-08/public/screenshots/`

The portal displays the screenshots associated with each lab when corresponding image files are available.

## 10. Testing

The following checks can be performed after starting the server:

- Open the home page.
- Verify the health-check endpoint.
- Open the lab listing and individual lab pages.
- View source code and available screenshots.
- Test supported script execution routes.
- Open the integrated server application routes.
- Check the dashboard API.
- Verify that requests are recorded in the log file.

## 11. Deployment

The application can be deployed to a Node.js hosting platform such as Render.

General deployment steps:

1. Push the project to GitHub.
2. Create a new Web Service on Render and connect the repository.
3. Set the **Root Directory** to `Lab-08`.
4. Set the **Build Command** to `npm install && npm run build`.
5. Set the **Start Command** to `npm start`.
6. Deploy the application and test its public URL.

The server should listen on `process.env.PORT` and bind to `0.0.0.0` for hosting compatibility. Deployment should be considered complete only after the public URL has been tested successfully.

## 12. Conclusion

Lab 08 combines the practical work from Labs 01–07 into a single web-based application. It provides a convenient way to explore lab details, view source code and screenshots, execute supported scripts, access server applications, and monitor incoming requests. This project improves the organization and accessibility of Node.js practical work and provides experience with server development, file handling, event-driven programming, and deployment.