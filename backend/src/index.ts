import express, { Request, Response } from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Interfaces
interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  assignees: Assignee[];
  status: string;
  priority: string;
  dueDate: string;
}

// Sample Data
const assignees: Assignee[] = Array.from({ length: 5 }).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.person.fullName(),
  avatar: faker.image.avatarGitHub(),
}));

const tasks: Task[] = Array.from({ length: 50 }).map((_, index) => ({
  id: (index + 1).toString(),
  assignees: faker.helpers.arrayElements(assignees, { min: 1, max: 3 }),
  status: faker.helpers.arrayElement(['Pending', 'In Progress', 'Completed']),
  priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
  dueDate: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
}));

// Routes
app.get('/api/tasks', (_req: Request, res: Response<Task[]>) => {
  res.json(tasks);
});

app.put('/api/tasks/:id', (req: Request<{ id: string }, Task | string>, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).send('Task not found');
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

app.get('/api/columns', (_req: Request, res: Response) => {
  res.json([
    { field: 'id', headerName: 'ID', type: 'link' },
    { field: 'status', headerName: 'Status', type: 'dropdown' },
    { field: 'priority', headerName: 'Priority', type: 'text' },
    { field: 'dueDate', headerName: 'Due Date', type: 'date' },
    { field: 'assignees', headerName: 'Assignees', type: 'assignee' },
  ]);
});

app.get('/api/assignees', (_req: Request, res: Response<Assignee[]>) => {
  res.json(assignees);
});

app.get('/api/assignees/:id', (req: Request<{ id: string }>, res: Response<Assignee | string>) => {
  const { id } = req.params;
  const assignee = assignees.find((a) => a.id === id);
  if (!assignee) return res.status(404).send('Assignee not found');
  res.json(assignee);
});

app.post('/api/assignees', (req: Request<{}, Assignee | string, Assignee>, res: Response) => {
  const { id, name, avatar } = req.body;
  if (!id || !name || !avatar) return res.status(400).send('Missing fields');
  if (assignees.find((a) => a.id === id)) {
    return res.status(409).send('Assignee already exists');
  }
  const newAssignee: Assignee = { id, name, avatar };
  assignees.push(newAssignee);
  res.status(201).json(newAssignee);
});

app.delete('/api/assignees/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const index = assignees.findIndex((a) => a.id === id);
  if (index === -1) return res.status(404).send('Assignee not found');
  assignees.splice(index, 1);

  tasks.forEach((task) => {
    task.assignees = task.assignees.filter((a) => a.id !== id);
  });

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
