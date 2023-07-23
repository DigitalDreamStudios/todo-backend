import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiResponse } from 'src/common/types/ApiResponse.type';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<ApiResponse> {
    return this.todoService.create(createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<ApiResponse> {
    return this.todoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  findOne(@Query('id') id: string): Promise<ApiResponse> {
    return this.todoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<ApiResponse> {
    return this.todoService.update(+id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse> {
    return this.todoService.remove(+id);
  }
}
