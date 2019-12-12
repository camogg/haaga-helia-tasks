import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

const Theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: { main: red[800] },
		secondary: { main: red[600] }
	}
});

export default Theme;
