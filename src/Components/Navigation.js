import React from "react";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	Drawer,
	Toolbar,
	AppBar,
	List,
	CssBaseline,
	Typography,
	ListItem,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import SportsIcon from "@material-ui/icons/Sports";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar
}));

const Navigation = props => {
	const classes = useStyles();

	return (
		<>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" noWrap>
						Trainer Manager
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<div className={classes.toolbar} />
				<List>
					<ListItem
						to={"/customers"}
						component={Link}
						selected={props.location.pathname === "/customers"}
						button
					>
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary="Customers" />
					</ListItem>
					<ListItem
						to={"/trainings"}
						component={Link}
						selected={props.location.pathname === "/trainings"}
						button
					>
						<ListItemIcon>
							<SportsIcon />
						</ListItemIcon>
						<ListItemText primary="Trainings" />
					</ListItem>
				</List>
			</Drawer>
		</>
	);
};

export default withRouter(Navigation);
