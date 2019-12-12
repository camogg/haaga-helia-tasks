import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";

import Theme from "./Theme";
import Navigation from "./Components/Navigation";
import Content from "./Components/Content";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex"
	}
}));

function App() {
	const classes = useStyles();

	return (
		<Router>
			<HelmetProvider>
				<Helmet
					defaultTitle="Trainer Manager"
					titleTemplate="%s - Trainer Manager"
				/>
				<MuiThemeProvider theme={Theme}>
					<div className={classes.root}>
						<Navigation />
						<Content />
					</div>
				</MuiThemeProvider>
			</HelmetProvider>
		</Router>
	);
}

export default App;
