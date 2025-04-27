
// enable localhost and prod
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://do-takehome-5.onrender.com';

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return res.json();
};

export const fetchColumns = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/columns`);
        return await handleResponse(res);
    } catch (error) {
        console.error('Error fetching columns:', error);
        throw error;
    }
};

export const fetchAssignees = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/assignees`);
        return await handleResponse(res);
    } catch (error) {
        console.error('Error fetching assignees:', error);
        throw error;
    }
};

export const fetchTasks = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/tasks`);
        return await handleResponse(res);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const updateTask = async (id: string, data: any) => {
    try {
        const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (error) {
        console.error(`Error updating task with id ${id}:`, error);
        throw error;
    }
};
