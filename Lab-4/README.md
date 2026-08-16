# Node.js Lab Assignment - 04

## Advanced Student Search, Filter and Sort API

### Student Information

**Name:** Rishabh Khatiwada  
**Scholar Number:** 23145018  
**Course:** BCA VII Semester  
**Subject:** CS403NOD - Node.js  
**Lab Number:** 04  
**College:** Dev Sanskriti Vishwavidyalaya  

---

## Objective

The objective of this lab is to create an advanced Student Directory API using Node.js and the built-in HTTP module.

The project stores student information in an array and provides routes to search students according to their course and marks.

---

## Technologies Used

- Node.js
- JavaScript
- HTTP Module
- URL Module
- VS Code

---

## Project Structure

```text
Lab-04/
│
├── advanced-server.js
├── advanced-output.png
└── README.md
```

---

## Student Data

The application stores student information in a JavaScript array.

Each student contains:

- ID
- Name
- Course
- Marks

Example:

```javascript
{
    id: 1,
    name: "Aditya Soni",
    course: "BCA",
    marks: 78
}
```

The application contains students from different courses such as:

- BCA
- BBA
- BIT

---

# Routes

## 1. Home Route

```text
GET /
```

URL:

```text
http://localhost:3000/
```

Output:

```text
Welcome to Node.js
```

---

## 2. All Students

```text
GET /students
```

URL:

```text
http://localhost:3000/students
```

This route returns all students stored in the student array.

---

## 3. Search Students by Course

The application allows students to be filtered according to their course.

### BCA Students

```text
http://localhost:3000/students/BCA
```

This returns only students whose course is BCA.

### BBA Students

```text
http://localhost:3000/students/BBA
```

This returns only students whose course is BBA.

### BIT Students

```text
http://localhost:3000/students/BIT
```

This returns only students whose course is BIT.

The course comparison is case-insensitive.

---

## 4. Search Students by Marks

The application also allows students to be searched according to their marks.

Example:

```text
http://localhost:3000/students/marks/75
```

This returns students whose marks are **greater than 75**.

For example:

```text
Aditya Soni          - 78
Ayush Ram Tripathi   - 82
Rishabh Khatiwada    - 88
Gauri                - 91
```

The filter uses the following condition:

```javascript
student.marks > marks
```

---

## Filtering Logic

The application uses the JavaScript `filter()` method to search the student array.

Example:

```javascript
const result = students.filter(student =>
    student.marks > marks
);
```

For course filtering:

```javascript
const result = students.filter(student =>
    student.course.toLowerCase() === course.toLowerCase()
);
```

---

## URL Path Handling

The application uses the URL path to read the course name and marks value.

For example:

```text
/students/BCA
```

The course is extracted from the URL using:

```javascript
pathName.split("/")[2]
```

For marks:

```text
/students/marks/75
```

The marks value is extracted using:

```javascript
pathName.split("/")[3]
```

---

## How to Run the Project

Open the terminal inside the Lab-04 folder.

Run:

```bash
node advanced-server.js
```

The server will start at:

```text
http://localhost:3000
```

---

## Testing URLs

### Home

```text
http://localhost:3000/
```

### All Students

```text
http://localhost:3000/students
```

### BCA Students

```text
http://localhost:3000/students/BCA
```

### BBA Students

```text
http://localhost:3000/students/BBA
```

### BIT Students

```text
http://localhost:3000/students/BIT
```

### Students with Marks Greater Than 75

```text
http://localhost:3000/students/marks/75
```

---

## Screenshot

The `advanced-output.png` file contains screenshots of the tested API routes and their outputs.

The screenshots demonstrate:

- Home route
- All students
- Course filtering
- Marks filtering

---

## Error Handling

If an invalid route is requested, the server returns a `404` response.

Example:

```json
{
    "error": "Route not found"
}
```

---

## Key Concepts Learned

Through this lab, the following Node.js concepts were practiced:

- Creating an HTTP server
- Handling different routes
- Using the Node.js URL module
- Reading values from URL paths
- Using arrays of objects
- Using the `filter()` method
- Filtering students by course
- Filtering students by marks
- Returning JSON responses
- Handling 404 errors

---

## Author

**Rishabh Khatiwada**

BCA VII Semester  
Dev Sanskriti Vishwavidyalaya

---

## Subject

**CS403NOD - Node.js**

**Lab Assignment - 04**