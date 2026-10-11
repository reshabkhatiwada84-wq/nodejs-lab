const http = require("http");
const url = require("url");

const PORT = 3000;

const students = [
    {
        id: 1,
        name: "Aditya Soni",
        course: "BCA",
        marks: 78
    },
    {
        id: 2,
        name: "Bhaskar Mall",
        course: "BCA",
        marks: 65
    },
    {
        id: 3,
        name: "Gaurav Kumar",
        course: "BIT",
        marks: 82
    },
    {
        id: 4,
        name: "Aman Pratap Singh",
        course: "BIT",
        marks: 55
    },
    {
        id: 5,
        name: "Sayon Koley",
        course: "BBA",
        marks: 71
    },
    {
        id: 6,
        name: "Rishabh Khatiwada",
        course: "BCA",
        marks: 88
    },
    {
        id: 7,
        name: "Akansha Rana",
        course: "BIT",
        marks: 91
    },
    {
        id: 8,
        name: "Amit Tiwari",
        course: "BIT",
        marks: 62
    },

     {
        id: 9,
        name: "Ashutosh Sukla",
        course: "BBA",
        marks: 78
    },

     {
        id: 9,
        name: "Rohit Kumar",
        course: "BBA",
        marks: 84
    },

     {
        id: 10,
        name: "Raman Singh",
        course: "BBA",
        marks: 92
    },

     {
        id: 11,
        name: "Sumit Sukla",
        course: "BA",
        marks: 95
    },

     {
        id: 12,
        name: "Ram Mohan",
        course: "BA",
        marks: 88
    }
];

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    // Home Route
    if (pathName === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("Welcome to Avdanced-Server.js of Node.js");
    }

    // All Students Route
    else if (pathName === "/students") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(students, null, 4));
    }

    // Marks Filter Route

else if (pathName.startsWith("/students/marks/")) {

    const marks = Number(pathName.split("/")[3]);

    const result = students.filter(student =>
        student.marks > marks
    );

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(result, null, 4));
}
    // Course Filter Route

    else if (pathName.startsWith("/students/")) {

        const course = pathName.split("/")[2];

        const result = students.filter(student =>
            student.course.toLowerCase() === course.toLowerCase()
        );

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(result, null, 4));
    }

    // Unknown Route
    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            error: "Route not found"
        }, null, 4));
    }

});

server.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});