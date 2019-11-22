import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, fade } from "@material-ui/core/styles";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Typography,
	Paper,
	Checkbox,
	IconButton,
	Tooltip,
	CircularProgress,
	InputBase
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc"
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy);
}

const headCells = [
	{
		id: "firstname",
		numeric: false,
		disablePadding: false,
		label: "Firstname"
	},
	{ id: "lastname", numeric: false, disablePadding: false, label: "Lastname" },
	{ id: "city", numeric: false, disablePadding: false, label: "City" },
	{ id: "email", numeric: false, disablePadding: false, label: "Email" },
	{ id: "phone", numeric: false, disablePadding: false, label: "Phone" }
];

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort
	} = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={numSelected === rowCount && rowCount !== 0}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all desserts" }}
					/>
				</TableCell>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "default"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={order}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
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
					Customers
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
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
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(3)
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	tableWrapper: {
		overflowX: "auto"
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1
	}
}));

export default function Customers() {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("firstname");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [search, setSearch] = React.useState("");
	const [rowsPerPage, setRowsPerPage] = React.useState(
		Math.round(window.innerHeight / 80)
	);
	const [customers, setCustomers] = React.useState([]);

	React.useEffect(_ => {
		let customers = [];
		fetch("https://customerrest.herokuapp.com/api/customers")
			.then(resp => resp.json())
			.then(function(data) {
				data.content.map(c =>
					customers.push({
						firstname: c.firstname,
						lastname: c.lastname,
						city: c.city,
						email: c.email,
						phone: c.phone
					})
				);
				setCustomers(customers);
			});
	}, []);

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === "desc";
		setOrder(isDesc ? "asc" : "desc");
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = customers.map(n => n);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = name => selected.indexOf(name) !== -1;

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					search={search}
					setSearch={setSearch}
				/>
				<div className={classes.tableWrapper}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={"medium"}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={customers.length}
						/>
						<TableBody>
							{customers.length === 0 ? (
								<TableRow>
									<TableCell align="center" colSpan={6}>
										<CircularProgress size={30} />
									</TableCell>
								</TableRow>
							) : (
								stableSort(customers, getSorting(order, orderBy))
									.filter(c => {
										return Object.values(c)
											.map(val =>
												val.toLowerCase().search(search.toLowerCase()) === -1
													? false
													: true
											)
											.includes(true);
									})
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const isItemSelected = isSelected(row);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												onClick={event => handleClick(event, row)}
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.email}
												selected={isItemSelected}
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={isItemSelected}
														inputProps={{ "aria-labelledby": labelId }}
													/>
												</TableCell>
												<TableCell component="th" id={labelId} scope="row">
													{row.firstname}
												</TableCell>
												<TableCell align="left">{row.lastname}</TableCell>
												<TableCell align="left">{row.city}</TableCell>
												<TableCell align="left">{row.email}</TableCell>
												<TableCell align="left">{row.phone}</TableCell>
											</TableRow>
										);
									})
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					rowsPerPageOptions={[
						rowsPerPage !== 10 && rowsPerPage !== 25 ? rowsPerPage : 5,
						10,
						25
					]}
					component="div"
					count={customers.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						"aria-label": "previous page"
					}}
					nextIconButtonProps={{
						"aria-label": "next page"
					}}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
