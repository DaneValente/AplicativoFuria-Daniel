import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { TasksService, Task } from './tasks.service';
import { CreateTaskDto } from '../twitter/dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Task {
    const task = this.tasksService.findOne(id);
    if (!task) throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    return task;
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() task: Partial<Task>): Task {
    const updatedTask = this.tasksService.update(id, task);
    if (!updatedTask) throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    return updatedTask;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): boolean {
    return this.tasksService.delete(id);
  }
}