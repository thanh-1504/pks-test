import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CourseQueryDTO, CreateCourseDTO, UpdateCourseDTO } from './course.dto';

@Injectable()
export class CourseRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getCourses(payload: { query?: CourseQueryDTO; isAdmin: boolean }) {
    const { search, category } = payload.query ?? {};
    return this.prismaService.course.findMany({
      where: {
        deletedAt: null,
        ...(payload.isAdmin ? {} : { isHidden: false }),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  getCourseById(id: number) {
    return this.prismaService.course.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getCategories() {
    const rows = await this.prismaService.course.findMany({
      where: {
        deletedAt: null,
        isHidden: false,
      },
      distinct: ['category'],
      select: {
        category: true,
      },
    });
    return rows.map((row) => row.category);
  }

  createCourse(payload: CreateCourseDTO) {
    const { name, capacity, category, instructor, tuition, description } =
      payload;
    return this.prismaService.course.create({
      data: {
        name,
        category,
        tuition,
        instructor,
        description,
        capacity,
        enrolledCount: 0,
      },
    });
  }

  updateCourse(payload: UpdateCourseDTO, id: number) {
    return this.prismaService.course.update({
      where: { id, deletedAt: null },
      data: payload,
    });
  }

  deleteCourse(id: number) {
    return this.prismaService.course.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
