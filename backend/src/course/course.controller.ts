import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { Public } from 'src/shared/decorators/public.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CourseQueryDTO, CreateCourseDTO, UpdateCourseDTO } from './course.dto';
import { CourseService } from './course.service';

@Controller('')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Public()
  @Get('courses')
  getCourses(@Query() query: CourseQueryDTO) {
    return this.courseService.getCourses(query);
  }

  @Public()
  @Get('courses/categories')
  getCategories() {
    return this.courseService.getCategories();
  }

  @Public()
  @Get('courses/:id')
  getCourse(@Param('id', ParseIntPipe) idCourse: number) {
    return this.courseService.getCourseDetail(idCourse);
  }

  @Roles([Role.ADMIN])
  @Get('admin/courses')
  getCourseForAdmin(@Query() query: CourseQueryDTO) {
    return this.courseService.getCourses(query, Role.ADMIN);
  }

  @Roles([Role.ADMIN])
  @Post('admin/courses')
  create(@Body() payload: CreateCourseDTO) {
    return this.courseService.createCourse(payload);
  }

  @Roles([Role.ADMIN])
  @Patch('admin/courses/:id')
  update(
    @Body() payload: UpdateCourseDTO,
    @Param('id', ParseIntPipe) idCourse: number,
  ) {
    return this.courseService.updateCourse(payload, idCourse);
  }

  @Roles([Role.ADMIN])
  @Delete('admin/courses/:id')
  delete(@Param('id', ParseIntPipe) idCourse: number) {
    return this.courseService.deleteCourse(idCourse);
  }
}
