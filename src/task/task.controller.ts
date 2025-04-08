import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    username: string;
  };
}

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() dto: CreateTaskDto, @Req() req: RequestWithUser) {
    this.logger.debug(`Creating task for user: ${JSON.stringify(req.user)}`);
    return this.taskService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current user' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Req() req: RequestWithUser) {
    return this.taskService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', type: 'number', description: 'Task ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.taskService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', type: 'number', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    return this.taskService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'Task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiParam({ name: 'id', type: 'number', description: 'Task ID' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.taskService.remove(id, req.user.userId);
  }
}
