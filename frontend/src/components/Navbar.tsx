import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-blue-600 font-bold text-xl">
          PKS Courses
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/courses" className="text-gray-600 hover:text-blue-600">
            Khóa học
          </Link>

          {user ? (
            <>
              {user.role === "STUDENT" && (
                <Link
                  to="/my-courses"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Khóa học của tôi
                </Link>
              )}

              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin/courses"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Quản lý khóa học
                  </Link>
                  <Link
                    to="/admin/enrollments"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Danh sách ghi danh
                  </Link>
                </>
              )}

              <span className="text-sm text-gray-500">{user.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
