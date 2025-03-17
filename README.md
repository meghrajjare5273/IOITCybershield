# CyberShield Attendance System

<div align="center">
    <img src="./public/logo.png" alt="CyberShield Logo" width=200 />
</div>

Welcome to the **CyberShield Attendance System**, a web application designed to streamline attendance monitoring for students enrolled in courses under the CyberShield Club. This system offers an intuitive admin interface for managing students, courses, sessions, and attendance records, all tailored to enhance the club's cybersecurity education initiatives.

🔗 **Live Demo**: [cybershield-pied.vercel.app](https://cybershield-pied.vercel.app)

---

## ✨ Features

- **Student Management**: Add, delete, and search students with ease, including bulk uploads via Excel.
- **Course Administration**: Create and manage courses, enroll students, and schedule sessions.
- **Attendance Tracking**: Record and monitor attendance for each course session with detailed reports.
- **Admin Dashboard**: Get a quick overview of student counts, course stats, and upcoming sessions.
- **Responsive Design**: Fully optimized for desktop and mobile devices with a sleek, modern UI.
- **Secure Authentication**: Email and password-based login powered by Better Auth.
- **Data Persistence**: PostgreSQL database with Prisma ORM for reliable storage.

---

## 🛠️ Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/) with TypeScript
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Libraries**: ExcelJS (for bulk uploads), Framer Motion (animations), Lucide React (icons)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Usage

The application features an admin dashboard accessible after logging in. Here's a brief guide on how to use the main functionalities:

1. **Sign In**: Use the admin credentials to access the dashboard at `/auth/sign-in`.
2. **Manage Students**: Navigate to `/admin/students` to add, search, or view attendance reports.
3. **Handle Courses**: Go to `/admin/courses` to create courses, enroll students, or schedule sessions.
4. **Track Attendance**: Access specific session pages (e.g., `/admin/courses/[courseId]/sessions/[sessionId]/attendance`) to mark attendance.

The dashboard is designed to be intuitive, with clear navigation and responsive design for ease of use on various devices.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

For more details, check out the [Next.js GitHub repository](https://github.com/vercel/next.js) for inspiration and guidelines.

---

## 📧 Contact

For questions or feedback, reach out to the CyberShield Club maintainers via [GitHub Issues](https://github.com/meghrajjare5273/meghrajjare5273-ioitcybershield/issues).

---

**Built with ❤️ by the CyberShield Club Team**  
_Empowering cybersecurity education, one attendance at a time._
