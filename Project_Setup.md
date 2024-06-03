# Project Setup Guide

## 1. Set Up the Roles

**Step 1:** Upload the `final roles.json` file to MongoDB.

- **Path:** MongoDB -> roles folder
- **Actions:** 
  - Delete any existing `roles.json` file.
  - Import the new `final roles.json` file.

**Important Considerations:**
- Run `npm install`.
- Ensure the Node Version Manager (nvm) is up to date.
- Use Node.js version 20: `nvm use 20`.
- Start the application: `npm start`.

## 2. Setting Up Admin

**Step 2:** Create an Admin using Postman.

- **Role ID:** Assign the role ID according to your MongoDB Compass.
- **Method:**
  - Open MongoDB Compass.
  - Locate the IDs for various roles.
  - Copy the ID corresponding to the Admin role.
  - Paste this ID into the Create Admin section in Postman.

**For Windows Users:**
- To run Nodemon or the backend server, use: `npm run dev`.

## 3. Create an Institution Admin and Register It

**Step 3:** Register an Institution Admin.

- **Importance:** Setting up an Institution Admin is crucial. This step allows you to obtain a list of institutions, which is necessary for registering researchers or graduates.

## 4. Register More Users

**Step 4:** Register additional users as needed.

- **Purpose:** Registering more users ensures a smooth workflow and an efficient visual appearance.

## 5. Set Up a Route for File Storage

**Step 5:** Configure the route for file storage.

- **Path:** 
  - Server -> middleware -> multer.js
  - Update `const staticDirectory` in `App.js` of the server.

**Method:**
- Update the `const staticDirectory` in `App.js` and `multer.js` by providing the appropriate path for file storage.

## 6. Store the Documents in a Public Folder

**Step 6:** Initialize a public directory for file storage.

- **Path:** Server -> src -> public
- **Method:**
  - Ensure an empty public directory is initialized every time.
  - Store the files in this public directory.

---

Following this guide will ensure a seamless and efficient project setup. 
