# Frontend Application

This is the frontend application for the Attendance Management System.

## Available Features

- **Dashboard**: Overview of attendance data.
- **Employees**: Manage employee information (CRUD).
- **Designations**: Manage employee designations (CRUD).
- **Branches**: Manage company branches (CRUD).
- **Reports**:
  - Monthly Report
  - Daily Report
  - Absentee Report
  - Attendance Matrix

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/api`: API client modules for interacting with the backend.
- `src/components`: Reusable UI components.
- `src/context`: React Context for authentication.
- `src/pages`: Main application pages.
- `src/utils`: Utility functions.

## Branch Management (New Feature)

This feature allows for the creation, reading, updating, and deletion of company branch information. It includes:

- A responsive table to display branches with search functionality.
- A modal form for adding and editing branch details, including client-side validation for name, address, opening time, and closing time.
- Confirmation modal for deleting branches.

**API Endpoints Used:**

- `GET /branches`: Paginated list of branches with optional search.
- `GET /branches?select2=true`: List of branches (id, name) for dropdowns.
- `POST /branches`: Create a new branch.
- `GET /branches/{id}`: Retrieve details of a specific branch.
- `PUT /branches/{id}`: Update an existing branch.
- `DELETE /branches/{id}`: Soft delete a branch.
