import React, { useState } from "react";
import { TAssignee, TColumn } from "../types/types";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
} from "@mui/material";
import Row from "./TableComponents/TableRow";

const cellStyle: React.CSSProperties = {
    padding: '8px 12px',
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
    cursor: 'pointer',
};

const AssignTable: React.FC<AssignTableProps> = ({
    allAssignees,
    columns,
    editedValue,
    handleSaveOnBlur,
    handleCellClick,
    handleInputChange,
    handleRemoveAssignee,
    isEditing,
    setAnchorEl,
    tasks,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage,] = useState(5); // You can allow user to change if you want

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const paginatedTasks = tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: "100%", overflowX: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(col => (
                            <TableCell key={col.field} sx={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>
                                {col.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedTasks.map(row => (
                        <Row
                            key={row.id}
                            row={row}
                            columns={columns}
                            editedValue={editedValue}
                            handleCellClick={handleCellClick}
                            isEditing={isEditing}
                            cellStyle={cellStyle}
                            setAnchorEl={setAnchorEl}
                            handleInputChange={handleInputChange}
                            handleSaveOnBlur={handleSaveOnBlur}
                            handleRemoveAssignee={handleRemoveAssignee}
                            allAssignees={allAssignees}
                        />
                    ))}
                </TableBody>
            </Table>
            {/* paginate to avoid large renders */}
            <TablePagination
                component="div"
                count={tasks.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5]}
            />
        </Box>
    );
};

export default AssignTable;

interface AssignTableProps {
    allAssignees: TAssignee[];
    columns: TColumn[];
    editedValue: any;
    handleSaveOnBlur: () => void;
    handleCellClick: (id: string, field: string, value: any) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isEditing: (id: string, field: string) => boolean;
    handleRemoveAssignee: (assignee: TAssignee) => Promise<void>;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    tasks: Array<{ [key: string]: any }>;
}
