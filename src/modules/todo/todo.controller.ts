import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiResponse } from 'src/common/types/ApiResponse.type';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<ApiResponse> {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(): Promise<ApiResponse> {
    return this.todoService.findAll();
  }

  @Get('filter')
  findOne(@Query('id') id: string): Promise<ApiResponse> {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<ApiResponse> {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse> {
    return this.todoService.remove(+id);
  }
}
