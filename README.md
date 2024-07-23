# Archimed Full Stack Developer Case Study

## Overview

This project is designed to automate the process of sending capital call invoices to investors for ARCHIMED, a healthcare private equity company. The project consists of a React frontend, a Django backend, and a PostgreSQL database. The main features include managing investors, generating bills, and creating capital calls based on specific business rules.

## Technologies Used

- **Frontend:** React with TailwindCSS for styling.
- **Backend:** Django REST Framework.
- **Database:** PostgreSQL.

## Assumptions

### Bills Generation

- **Assumption:** Initially, there are no bills. Bills are generated automatically when the bills page is accessed. The generation of bills is based on each investor's investment amount, investment date, and the fee percentage set by the company.

### Capital Calls

- **Assumption:** A capital call is due 30 days after its issue date. This is used to determine the due date of the capital calls generated by the system.

## Installation and Setup

To run the application, you'll need to set up both the frontend (React) and backend (Django) parts of the project.

### Frontend Setup

#### Navigate to the `client` directory:

```bash
cd "/Users/moustaphakebe/Documents/Job Hunt/Archimed/archimed-case-study/client"
```
