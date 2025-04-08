import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(username: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ username, password: hashed });
    return this.usersRepo.save(user);
  }
}
