import React from "react";
import { Popover, Box, Avatar, Typography, Button, TextField, Autocomplete } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { TAssignee, TColumnTypes } from "../../types/types";

const AssigneePopover = React.memo((
    { allAssignees, anchorEl, editedValue, editingCell, handleAddAssignee, handleSaveOnBlur, open, setAnchorEl }: AssigneePopoverProps
) => {
    // Filter out already assigned users
    const availableAssignees = editingCell?.field === TColumnTypes.Assignees
        ? allAssignees.filter(a =>
            !Array.isArray(editedValue) || !editedValue.some((av: any) => av.id === a.id)
        )
        : [];

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
                handleSaveOnBlur();
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 2, minWidth: 250 }}>
                {editingCell?.field === TColumnTypes.Assignees && (
                    <>
                        {availableAssignees.length > 0 ? (
                            <Autocomplete
                                options={availableAssignees}
                                getOptionLabel={(option) => option.name}
                                onChange={(_, value) => {
                                    if (value) {
                                        handleAddAssignee({ ...value, avatar: value.avatar ?? '' });
                                    }
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props} key={option.id}>
                                        <Avatar src={option.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Add Assignee" size="small" />
                                )}
                                size="small"
                                disableClearable
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">All assigned</Typography>
                        )}
                    </>
                )}
            </Box>
            <Button onClick={() => setAnchorEl(null)} sx={{ m: 1 }}>
                <GridCloseIcon fontSize="small" />
            </Button>
        </Popover>
    );
});

export default AssigneePopover;

export interface AssigneePopoverProps {
    allAssignees: TAssignee[];
    anchorEl: HTMLElement | null;
    editedValue: any;
    editingCell: { id: string; field: string } | null;
    handleAddAssignee: (assignee: TAssignee) => void;
    handleSaveOnBlur: () => Promise<void>;
    open: boolean;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}
