export type TAssignee = {
    id: string;
    name: string;
    avatar?: string;
};

export type TColumn = {
    field: keyof TTask | string;
    headerName: string;
    type: string;
    renderCell?: (
        row: TTask,
        editing: boolean,
        onChange: (val: any) => void,
        onBlur?: () => void
    ) => React.ReactNode;
};

export enum TColumnTypes {
    Assignees = 'assignees',
    Link = 'link',
    Text = 'text',
    Date = 'date',
}

export type TTask = {
    id: string;
    assignees: TUser[];
    status: string;
    priority: string;
    dueDate: string;
};

export type TUser = {
    id: string;
    name: string;
    avatar: string;
};