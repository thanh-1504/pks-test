import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { formatResponseCourse } from 'src/shared/utils/course.util';
import { CourseQueryDTO, CreateCourseDTO, UpdateCourseDTO } from './course.dto';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(private readonly coursesRepo: CourseRepository) {}

  async getCourses(query: CourseQueryDTO, role?: Role) {
    const isAdmin = role === Role.ADMIN;
    return this.coursesRepo.getCourses({ query, isAdmin });
  }

  async getCategories() {
    return this.coursesRepo.getCategories();
  }

  async getCourseDetail(id: number) {
    const course = await this.coursesRepo.getCourseById(id);
    if (!course || course.isHidden) throw new NotFoundException('Khóa học không tồn tại');
    return formatResponseCourse(course);
  }

  async createCourse(payload: CreateCourseDTO) {
    const newCourse = await this.coursesRepo.createCourse(payload);
    return formatResponseCourse(newCourse);
  }

  async updateCourse(payload: UpdateCourseDTO, id: number) {
    const course = await this.coursesRepo.getCourseById(id);
    if (!course) throw new NotFoundException('Khóa học không tồn tại');
    if (payload.capacity && payload.capacity < course.enrolledCount)
      throw new ConflictException(
        'Không thể giảm số lượng học viên thấp hơn số lượng đã đăng ký',
      );
    const updatedCourse = await this.coursesRepo.updateCourse(payload, id);
    return formatResponseCourse(updatedCourse);
  }

  async deleteCourse(id: number) {
    const course = await this.coursesRepo.getCourseById(id);
    if (!course) throw new NotFoundException('Khóa học không tồn tại');
    await this.coursesRepo.deleteCourse(id);
    return {
      message: 'Xóa khóa học thành công',
    };
  }
}
