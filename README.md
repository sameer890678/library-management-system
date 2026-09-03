# 📚 Library Management System

A modern, full-stack library management web application for managing books, members, borrowing records, and administrative operations.

### 🌐 Live Website

**[Visit the Library Management System](https://library-management-system-beta-orpin.vercel.app/)**

---

## ✨ Features

### 👤 Authentication & Members

* User registration and login
* Email confirmation
* Password reset
* Password visibility controls
* Admin approval system
* Pending, approved, and rejected account statuses
* Role-based access control

### 📖 Book Management

* Add, edit, and delete books
* Track total and available copies
* Search by title, author, or ISBN
* Filter by category
* Pagination
* Database-level protection against deleting books with borrowed copies

### 🔄 Borrowing System

* Borrow available books
* Select due dates
* Return borrowed books
* Automatic availability tracking
* Overdue status tracking
* Personal borrowing history

### 🛠️ Admin Dashboard

* Library statistics
* Book management
* Member management
* Signup approval requests
* Borrowing records
* Overdue book monitoring

### 📱 Responsive UI

Designed for desktop, tablet, and mobile devices with a modern responsive interface.

---

## 🧰 Tech Stack

| Technology           | Purpose                            |
| -------------------- | ---------------------------------- |
| **Next.js**          | Full-stack React framework         |
| **React**            | User interface                     |
| **TypeScript / TSX** | Application development            |
| **Tailwind CSS**     | Styling and responsive UI          |
| **Supabase**         | Backend, database & authentication |
| **PostgreSQL**       | Relational database                |
| **Lucide React**     | Interface icons                    |
| **Vercel**           | Deployment                         |
| **Git & GitHub**     | Version control                    |

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│      Next.js UI      │
│   React + Tailwind   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Supabase Client    │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
 Authentication  PostgreSQL
                 │
                 ├── RLS Policies
                 ├── Database Functions
                 └── Database Triggers
```

The application separates the user interface, authentication, database operations, and database-level security while keeping the system simple and maintainable.

---

## 🔐 Security & Business Rules

The system uses authentication, role-based authorization, Row Level Security, and database-level validation.

Important rules include:

* Only approved members can borrow books.
* Administrators cannot borrow or return books.
* Books with no available copies cannot be borrowed.
* Borrowing and returning automatically update availability.
* A book cannot be deleted while any copy is borrowed.
* A book can only be deleted when all copies have been returned.

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* Git
* A Supabase project

### Installation

```bash
git clone <repository-url>
cd library-management-system
npm install
```

Create your local environment configuration with the required Supabase variables, then run:

```bash
npm run dev
```

The application will be available at the local development URL provided by Next.js.

> **Never commit environment files, API keys, passwords, or other private credentials to GitHub.**

---

## 📂 Project Structure

```text
library-management-system/
├── app/
│   ├── admin/
│   ├── login/
│   ├── signup/
│   ├── members/
│   ├── my-borrowed-books/
│   └── component/
├── lib/
│   └── supabase.ts
├── public/
├── package.json
└── README.md
```

---

## 🎯 Project Goals

This project was built to apply practical full-stack software engineering concepts, including:

* CRUD operations
* Authentication & authorization
* Database design
* RLS security
* Database functions & triggers
* Responsive UI/UX
* API/database integration
* Deployment and version control

---

## 🔮 Future Improvements

* CSV/Excel bulk book import
* Email due-date notifications
* Fine management
* Book reservations
* Book cover images
* Advanced reports and analytics
* Audit logging

---

## 📄 License

No open-source license is currently specified for this project.
