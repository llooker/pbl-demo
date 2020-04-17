import React from 'react'
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {/* crucial */}
            {/* {value === index && <Box p={3}>{children}</Box>} */}
            <Box p={3}>{children}</Box>
        </Typography>
    );
}
