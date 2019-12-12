import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { DialogContent, Divider, TextField } from "@material-ui/core";
import Theme from "../Theme";
import Trainings from "./Trainings";

const useStyles = makeStyles(theme => ({
	appBar: {
		position: "relative"
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	content: {
		background: Theme.palette.background.default
	},
	paper: {
		padding: theme.spacing(3, 2)
	},
	input: {
		margin: 20
	},
	toolbar: {
		paddingTop: 10
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const CustomerDetails = props => {
	const classes = useStyles();
	const [customer, setCustomer] = useState({
		firstname: "",
		lastname: "",
		streetaddress: "",
		postcode: "",
		city: "",
		email: "",
		phone: ""
	});
	let [firstname, setFirstname] = useState("");
	let [lastname, setLastname] = useState("");

	useEffect(
		_ => {
			if (props.detailsMode === "edit") {
				setCustomer(props.customer);
				setFirstname(props.customer.firstname);
				setLastname(props.customer.lastname);
			}
		},
		[props.detailsMode, props.customer]
	);

	const handleClose = () => {
		props.setOpen(false);
		setTimeout(_ => props.setSelectedCustomer(null), 300);
	};

	const handleChange = event => {
		const {
			target: { name, value }
		} = event;
		setCustomer({ ...customer, [name]: value });
	};

	return (
		<div>
			<Dialog
				fullScreen
				open={props.open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={_ => {
								if (props.detailsMode === "edit") {
									handleClose();
								} else {
									props.setDetailsMode("edit");
									handleClose();
								}
							}}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							{props.detailsMode === "edit"
								? firstname + " " + lastname
								: "Add new customer"}
						</Typography>
					</Toolbar>
				</AppBar>
				<DialogContent className={classes.content}>
					<div className={classes.toolbar} />
					<Paper className={classes.paper}>
						<Typography variant="h5" component="h3">
							{props.detailsMode === "edit"
								? firstname + "'s Details"
								: "New customer's details"}
						</Typography>
						<Divider />
						<TextField
							className={classes.input}
							label="Firstname"
							variant="outlined"
							name="firstname"
							onChange={handleChange}
							value={customer.firstname}
						/>
						<TextField
							className={classes.input}
							label="Lastname"
							variant="outlined"
							name="lastname"
							onChange={handleChange}
							value={customer.lastname}
						/>
						<TextField
							className={classes.input}
							label="Addres"
							variant="outlined"
							name="streetaddress"
							onChange={handleChange}
							value={customer.streetaddress}
						/>
						<TextField
							className={classes.input}
							label="Post Code"
							variant="outlined"
							name="postcode"
							onChange={handleChange}
							value={customer.postcode}
						/>
						<TextField
							className={classes.input}
							label="City"
							variant="outlined"
							name="city"
							onChange={handleChange}
							value={customer.city}
						/>
						<TextField
							className={classes.input}
							label="Email"
							variant="outlined"
							name="email"
							onChange={handleChange}
							value={customer.email}
						/>
						<TextField
							className={classes.input}
							label="Phone"
							variant="outlined"
							name="phone"
							onChange={handleChange}
							value={customer.phone}
						/>
						<Button
							className={classes.input}
							color="primary"
							onClick={_ => {
								if (props.detailsMode === "edit") {
									props.editCustomer(customer);
									handleClose();
								} else {
									props.addCustomer(customer);
									props.setDetailsMode("edit");
									handleClose();
								}
							}}
							variant="contained"
						>
							Save
						</Button>
					</Paper>
					{props.detailsMode === "edit" ? (
						<Trainings customer={customer} />
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CustomerDetails;
