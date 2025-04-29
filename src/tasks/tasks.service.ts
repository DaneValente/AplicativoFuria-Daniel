import { Injectable } from '@nestjs/common';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}



@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Aprender NestJS', completed: false },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task | null {
    const task = this.tasks.find(task => task.id === id);
    return task || null; // Retorna null se não encontrar
  }

  create(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      id: this.tasks.length + 1,
      ...task,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, task: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null; // Retorna null se não encontrar
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...task };
    return this.tasks[taskIndex];
  }

  delete(id: number): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;
    this.tasks.splice(taskIndex, 1);
    return true;
  }
}
