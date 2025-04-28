# React + TypeScript + Vite + Node + Express
  A dynamic task management table where users can edit cells and manage assignees.
  Columns are generated based on data types.
  
# Built with:

  Frontend: React, TypeScript, Vite, Material UI (including Autocomplete)

  Backend: Node.js, Express

  Deployment: Frontend on Vercel, Backend on Render

# Architecture Decisions
  Dynamic Columns: The frontend generates table columns based on a schema from the backend, making the grid easily extensible.

  Editable Cells: Cells render specific components based on their data type.

  Used MaterialUI to build reusasable, accessible components, and to use useful table and autocomplete components

  Backend Mock Data: Assignees and tasks are generated using Faker.js for demo purposes.

  Frontend environment automatically selects localhost or production API based on window.location.hostname.

  Backend hosted separately on Render.

# Running Locally
  from both backend/frontend folders:
  
    npm install
    npm run dev

# Assumptions Made
  Editing is saved on cell blur (when a user clicks away from a cell).

# Known Limitations / Trade-Offs
  Only a subset of data types (text, date, link, default) are implemented.

  Responsiveness is basic

  No server-side pagination — all data is loaded at once.
# Optimization
  Memoize rows and popover to not re-render rows and assignees not being editing

  Pagination to not render all data at once

# Future Improvements
  Improve mobile responsiveness and small-screen handling.

  Extract cell editors and renderers into a dedicated component library.

  Add validation (e.g., date cannot be in the past).

  Implement server-side pagination and filtering.

  Optimistically update UI when editing a cell.

  Extend support for additional data types.

  Enhance error handling and loading states ie Skeletons.

# Deployment Links
Frontend (Vercel): [https://do-frontend.vercel.app/]

Backend (Render): [https://do-takehome-5.onrender.com]
