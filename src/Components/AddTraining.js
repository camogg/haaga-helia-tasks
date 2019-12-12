import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
	input: {
		margin: 20
	}
}));

const AddTraining = props => {
	const [training, setTraining] = useState({
		date: "",
		duration: "",
		activity: ""
	});
	const classes = useStyles();

	const handleClose = () => {
		props.setOpen(false);
	};

	const handleChange = event => {
		const {
			target: { name, value }
		} = event;
		setTraining({ ...training, [name]: value });
	};

	return (
		<div>
			<Dialog
				open={props.open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Add Training</DialogTitle>
				<DialogContent>
					<TextField
						className={classes.input}
						label="Date"
						variant="outlined"
						name="date"
						onChange={handleChange}
						value={training.date}
						helperText="YYYY-MM-DD HH:mm"
					/>
					<TextField
						className={classes.input}
						label="Duration"
						variant="outlined"
						name="duration"
						onChange={handleChange}
						value={training.duration}
					/>
					<TextField
						className={classes.input}
						label="Activity"
						variant="outlined"
						name="activity"
						onChange={handleChange}
						value={training.activity}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={_ => {
							props.addTraining(training);
							handleClose();
						}}
						color="primary"
						variant="contained"
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AddTraining;
