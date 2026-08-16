const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    console.log("Requested URL:", req.url);

    switch (req.url) {

        // Home Route
        case "/":
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`

      WELCOME TO MY NODE.JS SERVR

Name            : Rishabh Khatiwada
Scholar Number  : 23145018
Course          : BCA VII
Subject         : CS403NOD - Node.js
Lab Assignment  : 02

Hello!
Welcome to my first Node.js HTTP Server.
This server is created using the built-in
HTTP module of Node.js.

            `);
            break;

        // About Route
        case "/about":
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`
           ABOUT ME 

Name : Rishabh Khatiwada

I am a student of
Dev Sanskriti Vishwavidyalaya,
currently pursuing BCA VII Semester.

I am learning:
- Node.js

Thank you for visiting this page.
            `);
            break;

        // College Route
        case "/college":
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`
           COLLEGE DETAILS

College Name :
Dev Sanskriti Vishwavidyalaya

Department :
Computer Science

Course :
Bachelor of Computer Applications (BCA)

Semester :
VII Semester

Subject :
CS403NOD - Node.js

Location :
Haridwar, Uttarakhand

            `);
            break;

        // Profile Route (JSON)
        case "/profile":

            const profile = {
                name: "Rishabh Khatiwada",
                scholarNumber: "23145018",
                course: "BCA VII",
                semester: "7th",
                college: "Dev Sanskriti Vishwavidyalaya",
                department: "Computer Science",
                subject: "CS403NOD - Node.js",
                
            };

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(profile, null, 4));

            break;

        // 404 Route
        default:

            res.writeHead(404, {
                "Content-Type": "text/plain"
            });

            res.end(`
404 - PAGE NOT FOUND

Sorry!
The page you are looking for
does not exist.

Please check the URL and try again.
            `);

            break;
    }

});

server.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`);
});