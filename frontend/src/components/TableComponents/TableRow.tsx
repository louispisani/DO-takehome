import React from "react";
import { TableCell, Box, Avatar, Typography, IconButton, Link, TextField, TableRow } from "@mui/material";
import { GridCloseIcon, GridAddIcon } from "@mui/x-data-grid";
import { TAssignee, TColumn, TColumnTypes } from "../../types/types";
import { AssigneeTooltip } from "./AssigneeTooltip";
import { formatDateInput, formatDateVal } from "../../utl/util";
// memoize the rows to prevent unnecessary re-renders
const Row = React.memo(({
    allAssignees,
    cellStyle,
    columns,
    editedValue,
    handleSaveOnBlur,
    handleCellClick,
    handleInputChange,
    handleRemoveAssignee,
    isEditing,
    row,
    setAnchorEl,
}: RowProps) => {
    // render row dynamically based on the column type
    return (
        <TableRow key={row.id}>
            {columns.map(col => {
                const value = row[col.field];
                const editing = isEditing(row.id, col.field);

                if (col.field === TColumnTypes.Assignees) {
                    const displayedAssignees: TAssignee[] = (editing ? editedValue : value).slice(0, 3);
                    const extraAssignees: TAssignee[] = (editing ? editedValue : value).slice(3);
                    return (
                        <TableCell key={col.field} sx={{ padding: "8px", verticalAlign: "top" }}>
                            <Box
                                sx={{ ...cellStyle }}
                                onClick={() => handleCellClick(row.id, col.field, value)}
                            >
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                                    {displayedAssignees.map((a: TAssignee) => (
                                        <Box
                                            key={a.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                border: "1px solid #ccc",
                                                borderRadius: "16px",
                                                padding: "2px 8px",
                                                backgroundColor: "#f5f5f5",
                                            }}
                                        >
                                            <Avatar src={a.avatar} alt={a.name} sx={{ width: 24, height: 24 }} />
                                            <Typography
                                                variant="body2"
                                                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px" }}
                                            >
                                                {a.name}
                                            </Typography>
                                            {editing && (
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveAssignee(a);
                                                    }}
                                                >
                                                    <GridCloseIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}
                                    <IconButton
                                        size="small"
                                        disabled={(displayedAssignees.length + extraAssignees.length) === allAssignees.length}
                                        onClick={(e) => {
                                            setAnchorEl(e.currentTarget);
                                        }}
                                    >
                                        <GridAddIcon fontSize="small" />
                                    </IconButton>
                                    {extraAssignees.length > 0 && (
                                        <AssigneeTooltip extraAssignees={extraAssignees} />
                                    )}
                                </Box>
                            </Box>
                        </TableCell>
                    );
                }

                if (col.type === TColumnTypes.Link) {
                    return (
                        <TableCell key={col.field} sx={{ padding: "8px" }}>
                            <Box
                                sx={{ ...cellStyle }}
                                onClick={() => handleCellClick(row.id, col.field, value)}
                            >
                                <Link href={value} underline="hover" color="primary">
                                    {value}
                                </Link>
                            </Box>
                        </TableCell>
                    );
                }

                if (col.type === TColumnTypes.Date) {
                    return (
                        <TableCell key={col.field} sx={{ padding: "8px" }}>
                            <Box
                                sx={{
                                    ...cellStyle,
                                    width: "120px",
                                }}
                                onClick={() => handleCellClick(row.id, col.field, value)}
                            >
                                {editing ? (
                                    <TextField
                                        autoFocus
                                        type="date"
                                        value={formatDateInput(editedValue ?? value)}
                                        onChange={handleInputChange}
                                        onBlur={handleSaveOnBlur}
                                        onKeyDown={(e) => e.key === "Enter" && handleSaveOnBlur()}
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            "& .MuiInputBase-input": { fontSize: "14px", padding: "8px" },
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: "14px",
                                            width: "100%",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {formatDateVal(value)}
                                    </Typography>
                                )}
                            </Box>
                        </TableCell>
                    );
                }

                return (
                    <TableCell key={col.field} sx={{ padding: "8px" }}>
                        <Box
                            sx={{
                                ...cellStyle,
                                width: "120px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                overflow: "hidden",
                                cursor: "pointer",
                            }}
                            onClick={() => handleCellClick(row.id, col.field, value)}
                        >
                            {editing ? (
                                <TextField
                                    autoFocus
                                    value={editedValue}
                                    onChange={handleInputChange}
                                    onBlur={handleSaveOnBlur}
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveOnBlur()}
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        "& .MuiInputBase-input": { fontSize: "14px", padding: "8px" },
                                    }}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        width: "100%",
                                        fontSize: "14px",
                                    }}
                                >
                                    {value}
                                </Typography>
                            )}
                        </Box>
                    </TableCell>
                );
            })}
        </TableRow>
    )
});

export default Row;

interface RowProps {
    row: any;
    columns: TColumn[];
    editedValue: any;
    handleCellClick: (id: any, field: string, value: any) => void;
    isEditing: (id: any, field: string) => boolean;
    cellStyle: React.CSSProperties;
    setAnchorEl: (anchor: HTMLElement | null) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveOnBlur: () => void;
    handleRemoveAssignee: (assignee: TAssignee) => void;
    allAssignees: TAssignee[];
}
