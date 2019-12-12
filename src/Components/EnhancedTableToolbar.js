import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, fade } from "@material-ui/core/styles";
import {
	Toolbar,
	Typography,
	IconButton,
	Tooltip,
	InputBase,
	Button
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";

const EnhancedTableToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected, search, setSearch } = props;

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color="inherit"
					variant="subtitle1"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle">
					{props.title}
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton
						aria-label="delete"
						onClick={
							props.title === "Trainings"
								? props.deleteTrainings
								: props.deleteCustomers
						}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							onChange={e => setSearch(e.target.value)}
							value={search}
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput
							}}
							inputProps={{ "aria-label": "search" }}
						/>
					</div>
					<div>
						<Button
							style={{ marginLeft: 10 }}
							color="primary"
							onClick={_ => {
								if (props.title === "Trainings") {
									props.setOpen(true);
								} else {
									props.setDetailsMode("add");
									props.setDetailsOpen(true);
								}
							}}
							variant="contained"
						>
							New
						</Button>
					</div>
				</>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === "light"
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
			  },
	title: {
		flex: "1 1 100%"
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto"
		}
	},
	searchIcon: {
		width: theme.spacing(7),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	inputRoot: {
		color: "inherit"
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: 120,
			"&:focus": {
				width: 200
			}
		}
	}
}));

export default EnhancedTableToolbar;
