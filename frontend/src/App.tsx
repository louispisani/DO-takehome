import { useCallback, useEffect, useState } from 'react';


import {
  Box,
  LinearProgress,
} from '@mui/material';
import { fetchColumns, fetchAssignees, fetchTasks, updateTask } from './api/taskApi';
import { TAssignee, TColumn, TColumnTypes, TTask } from './types/types';
import AssigneePopover from './components/TableComponents/AssigneePopover';
import TaskTable from './components/TaskTable';

const App = () => {
  const [allAssignees, setAllAssignees] = useState<TAssignee[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [columns, setColumns] = useState<TColumn[]>([]);
  const [editedValue, setEditedValue] = useState<any>(() => '');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const isPopoverOpen = Boolean(editingCell?.field === TColumnTypes.Assignees && anchorEl);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch columns, assignees, and tasks in parallel
        const columnsPromise = fetchColumns();
        const assigneesPromise = fetchAssignees();
        const tasksPromise = fetchTasks();

        const [fetchedColumns, fetchedAssignees, fetchedTasks] = await Promise.all([
          columnsPromise,
          assigneesPromise,
          tasksPromise,
        ]);

        setColumns(fetchedColumns);
        setAllAssignees(fetchedAssignees);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCellClick = (id: string, field: string, value: any) => {
    setEditingCell({ id, field });
    setEditedValue(value);
  }

  // handleSaveOnBlur is called when the user clicks outside the input field
  const handleSaveOnBlur = useCallback(async () => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    const updatedTask = tasks.find((u) => u.id === id);
    if (!updatedTask) return;
    // Check if the edited value is different from the current task field value
    if (updatedTask[field as keyof TTask] === editedValue) {
      setEditingCell(null);
      return;
    }

    try {
      const result = await updateTask(id, { [field]: editedValue });
      setTasks((prevTasks) => prevTasks.map((u) => (u.id === id ? result : u)));
    } catch (err) {
      console.error('Save failed', err);
    }
    setEditingCell(null);
    setAnchorEl(null);
  }, [editingCell, editedValue, tasks]);

  const handleInputChange =
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditedValue(e.target.value);

  const isEditing = (id: string, field: string) =>
    editingCell?.id === id && editingCell.field === field;

  // remove assignee from the task
  const handleRemoveAssignee = async (assignee: TAssignee) => {
    if (!editingCell) return;
    const updatedTask = tasks.find((task) => task.id === editingCell.id);
    if (!updatedTask) return;
    const newAssignees = updatedTask.assignees.filter((a: TAssignee) => a.id !== assignee.id);

    try {
      const result = await updateTask(updatedTask.id, { assignees: newAssignees });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? result : task))
      );

      setEditedValue(newAssignees);
    } catch (err) {
      console.error('Error removing assignee', err);
    }
  };

  // add assignee to the task
  const handleAddAssignee = async (assignee: TAssignee) => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    if (!editedValue.find((av: any) => av.id === assignee.id)) {
      setEditedValue((prev: any[]) => [...prev, assignee]);
      try {
        const result = await updateTask(id, { [field]: [...editedValue, assignee] });
        setTasks((prevTasks) => prevTasks.map((u) => (u.id === editingCell?.id ? result : u)));
      } catch (err) {
        console.error('Save failed', err);
      }
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === editingCell?.id) {
            return {
              ...task,
              assignees: [
                ...(task.assignees || []),
                { ...assignee, avatar: assignee.avatar ?? '' },
              ],
            };
          }
          return task;
        })
      );
    }
  };

  if (isLoading) {
    return (
      <LinearProgress sx={{
        position: 'absolute',
        top: '50%',
        margin: '0 auto',
        left: 0,
        right: 0,
        width: '80%',
      }} />
    );
  }

  return (
    <Box p={3} display="flex" justifyContent="left" alignItems="left" flexDirection="column">
      <Box mb={2} sx={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        Task Management
      </Box>
      <AssigneePopover
        allAssignees={allAssignees}
        anchorEl={anchorEl}
        editedValue={editedValue}
        editingCell={editingCell}
        handleAddAssignee={handleAddAssignee}
        handleSaveOnBlur={handleSaveOnBlur}
        open={isPopoverOpen}
        setAnchorEl={setAnchorEl}
      />
      <TaskTable
        allAssignees={allAssignees}
        columns={columns}
        editedValue={editedValue}
        handleSaveOnBlur={handleSaveOnBlur}
        handleCellClick={handleCellClick}
        handleInputChange={handleInputChange}
        handleRemoveAssignee={handleRemoveAssignee}
        isEditing={isEditing}
        setAnchorEl={setAnchorEl}
        tasks={tasks}
      />
    </Box>
  );
};

export default App;
