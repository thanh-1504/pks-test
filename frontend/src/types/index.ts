
export type Role = 'STUDENT' | 'ADMIN';
export type EnrollmentStatus = 'ACTIVE' | 'CANCELLED';
export type CourseStatus = 'AVAILABLE' | 'FULL';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Course {
  id: number;
  name: string;
  category: string;
  instructor: string;
  description: string;
  tuition: number;
  capacity: number;
  enrolledCount: number;
  isHidden: boolean;
  status: CourseStatus;
  remainingSeats: number;
  createdAt: string; 
}

export interface CourseForm {
  name: string;
  category: string;
  instructor: string;
  description: string;
  tuition: string;
  capacity: string;
}

export interface MyEnrollment {
  id: number;
  status: EnrollmentStatus;
  enrolledAt: string; 
  course: {
    id: number;
    name: string;
    category: string;
    instructor: string;
    tuition: number;
  };
}

export interface AdminEnrollment {
  id: number;
  fullName: string;
  email: string;
  courseName: string;
  enrolledAt: string;
  status: EnrollmentStatus;
}


export interface ValidationError {
  path: string;
  message: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  path: string;
  timestamp: string;
}

