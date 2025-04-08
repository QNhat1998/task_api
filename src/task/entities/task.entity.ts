import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'The unique identifier of the task' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the task' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  @Column()
  description: string;

  @ApiProperty({ description: 'The ID of the user who owns this task' })
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The date when the task was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the task was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
