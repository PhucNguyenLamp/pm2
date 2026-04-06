import { Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Account() {
    const { user } = useContext(AuthContext);
    return (
        <Paper>
            <Typography variant="h3">Account</Typography>
            <Typography variant="h4">Name: {user}</Typography>
        </Paper>
    );
}
