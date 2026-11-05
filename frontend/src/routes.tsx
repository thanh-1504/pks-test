import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import RegisterPage from "./pages/RegisterPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import EnrollmentsPage from "./pages/admin/EnrollmentsPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/courses" replace /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:id", element: <CourseDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute roles={["STUDENT"]} />,
        children: [{ path: "my-courses", element: <MyCoursesPage /> }],
      },
      {
        element: <ProtectedRoute roles={["ADMIN"]} />,
        children: [
          { path: "admin/courses", element: <AdminCoursesPage /> },
          { path: "admin/enrollments", element: <EnrollmentsPage /> },
        ],
      },
    ],
  },
]);
