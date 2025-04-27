import { Tooltip, Box, Avatar, Typography } from "@mui/material"
import { TAssignee } from "../../types/types"

export const AssigneeTooltip = ({ extraAssignees }: { extraAssignees: TAssignee[] }) => {
    return (<Tooltip
        title={
            <Box>
                {extraAssignees.map((a: TAssignee) => (
                    <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={a.avatar} alt={a.name} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">{a.name}</Typography>
                    </Box>
                ))}
            </Box>
        }
        arrow
    >
        <Box
            sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '16px',
                backgroundColor: '#e0e0e0',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
            }}
        >
            +{extraAssignees.length}
        </Box>
    </Tooltip>
    )
}