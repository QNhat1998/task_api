import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });

    const savedTask = this.taskRepository.save(task);

    return savedTask;
  }

  async findAll(userId: number) {
    try {
      return await this.taskRepository.find({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to find tasks: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch tasks');
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find task: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    try {
      const task = await this.findOne(id, userId);
      const updated = await this.taskRepository.save({
        ...task,
        ...updateTaskDto,
      });
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update task: ${error.message}`);
      throw new InternalServerErrorException('Could not update task');
    }
  }

  async remove(id: number, userId: number) {
    try {
      const task = await this.findOne(id, userId);
      await this.taskRepository.remove(task);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to remove task: ${error.message}`);
      throw new InternalServerErrorException('Could not delete task');
    }
  }
}
