import React from "react";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Customers from "./Customers";
import Calendar from "./Calendar";

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
				<Route exact path="/" component={Customers} />
				<Route path="/customers" component={Customers} />
				<Route path="/calendar" component={Calendar} />
			</Switch>
		</main>
	);
};

export default Content;
