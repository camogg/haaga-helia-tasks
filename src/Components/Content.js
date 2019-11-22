import React from "react";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import Customers from "./Customers";

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingTop: 0
	},
	toolbar: theme.mixins.toolbar
}));

const Content = props => {
	const classes = useStyles();

	return (
		<main className={classes.content}>
			<div className={classes.toolbar} />
			<Switch>
				<Route
					exact
					path="/"
					component={_ => <Typography>Dashboard</Typography>}
				/>
				<Route path="/customers" component={Customers} />
			</Switch>
		</main>
	);
};

export default Content;
