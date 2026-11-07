import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-blue-600 font-bold text-xl shrink-0">
          PKS Courses
        </Link>
        <div className="hidden lg:flex items-center gap-4">
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
        {!isMenuOpen && (
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
            aria-label="Mở menu"
            aria-expanded={false}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Đóng menu"
        tabIndex={isMenuOpen ? 0 : -1}
        disabled={!isMenuOpen}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            PKS Courses
          </Link>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-blue-600"
            aria-label="Đóng menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
          <Link
            to="/courses"
            className="text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Khóa học
          </Link>

          {user?.role === "STUDENT" && (
            <Link
              to="/my-courses"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Khóa học của tôi
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/admin/courses"
                className="text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Quản lý khóa học
              </Link>
              <Link
                to="/admin/enrollments"
                className="text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Danh sách ghi danh
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-sm text-gray-500">{user.fullName}</span>
              <button
                onClick={handleLogout}
                className="self-start text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="self-start bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
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
