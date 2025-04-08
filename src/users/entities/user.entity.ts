import { AccessToken } from 'src/auth/entities/access-token.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn() // Tự động tạo timestamp khi tạo record
  created_at: Date; // Thời gian tạo record

  @UpdateDateColumn() // Tự động cập nhật timestamp khi cập nhật record
  updated_at: Date; // Thời gian cập nhật record
}
