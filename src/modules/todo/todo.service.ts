import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/types/ApiResponse.type';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<ApiResponse> {
    // Step 1: Fetch the user entity using the user ID from createTodoDto
    const user = await this.userRepository.findOne({
      where: { id: createTodoDto.userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Step 2: Create a new todo entity
    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      user_id: user.id,
    });
    await this.todoRepository.save(newTodo);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Todo created successfully',
      data: newTodo,
    };
  }

  async findAll(): Promise<ApiResponse> {
    const todos = await this.todoRepository.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Todos fetched successfully',
      data: todos,
    };
  }

  async findOne(id: number): Promise<ApiResponse> {
    const findTodo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!findTodo) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Todo fetched successfully',
      data: findTodo,
    };
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<ApiResponse> {
    const findTodo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!findTodo) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    const updatedTodo = await this.todoRepository.save({
      ...findTodo,
      ...updateTodoDto,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Todo updated successfully',
      data: updatedTodo,
    };
  }

  async remove(id: number): Promise<ApiResponse> {
    const findTodo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!findTodo) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    await this.todoRepository.remove(findTodo);

    return {
      statusCode: HttpStatus.OK,
      message: 'Todo deleted successfully',
      data: findTodo,
    };
  }
}
