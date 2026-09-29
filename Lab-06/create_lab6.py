import os

# Files required for Lab-06
files = [
    "sample.txt",
    "read-async.js",
    "read-sync.js",
    "write-file.js",
    "append-file.js",
    "delete-file.js",
    "async-await-version.js",
    "add-note.js",
    "read-notes.js",
    "reflection-notes.txt",
    "README.md"
]

# Create each file
for file in files:
    with open(file, "w", encoding="utf-8") as f:
        pass

print("Lab-06 files created successfully!")
print("\nFiles created:")

for file in files:
    print("✓", file)