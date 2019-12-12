import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Table,
	TableBody,
	TableCell,
	TablePagination,
	TableRow,
	Paper,
	Checkbox,
	CircularProgress
} from "@material-ui/core";
import Moment from "react-moment";

import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import AddTraining from "./AddTraining";

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
		id: "date",
		numeric: false,
		disablePadding: false,
		label: "Date"
	},
	{ id: "duration", numeric: false, disablePadding: false, label: "Duration" },
	{ id: "activity", numeric: false, disablePadding: false, label: "Activity" }
];

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

const Trainings = props => {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("firstname");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [search, setSearch] = React.useState("");
	const [rowsPerPage, setRowsPerPage] = React.useState(
		Math.round(window.innerHeight / 80)
	);
	const [trainings, setTrainings] = React.useState([]);
	const [open, setOpen] = React.useState(false);

	React.useEffect(
		_ => {
			fetchTrainingsCustomer(props.customer);
		},
		[props.customer]
	);

	const fetchTrainingsCustomer = customer => {
		let trainings = [];
		fetch(customer.links[2].href)
			.then(resp => resp.json())
			.then(function(data) {
				data.content.map(c => trainings.push(c));
				setTrainings(trainings);
			});
	};

	const addTraining = training => {
		training.customer = props.customer.links[0].href;
		training.date = new Date(training.date).toISOString();
		fetch("https://customerrest.herokuapp.com/api/trainings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(training)
		})
			.then(resp => resp.json())
			.then(function() {
				fetchTrainingsCustomer(props.customer);
			});
	};

	const deleteTrainings = _ => {
		selected.forEach(c => {
			fetch(c.links[0].href, {
				method: "DELETE"
			}).then(function() {
				fetchTrainingsCustomer(props.customer);
				setSelected([]);
			});
		});
	};

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === "desc";
		setOrder(isDesc ? "asc" : "desc");
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = trainings.map(n => n);
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
					deleteTrainings={deleteTrainings}
					setOpen={setOpen}
					title="Trainings"
				/>
				<div className={classes.tableWrapper}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={"medium"}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							headCells={headCells}
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={trainings.length}
						/>
						<TableBody>
							{trainings.length === 0 ? (
								<TableRow>
									<TableCell align="center" colSpan={6}>
										<CircularProgress size={30} />
									</TableCell>
								</TableRow>
							) : (
								stableSort(trainings, getSorting(order, orderBy))
									.filter(c => {
										return Object.values(c)
											.map(val =>
												typeof val !== "string"
													? false
													: val.toLowerCase().search(search.toLowerCase()) ===
													  -1
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
												key={row.date}
												selected={isItemSelected}
												style={{ cursor: "pointer" }}
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={isItemSelected}
														inputProps={{ "aria-labelledby": labelId }}
														onClick={event => handleClick(event, row)}
													/>
												</TableCell>
												<TableCell component="th" id={labelId} scope="row">
													<Moment format="YYYY-MM-DD HH:mm" date={row.date} />
												</TableCell>
												<TableCell align="left">{row.duration}</TableCell>
												<TableCell align="left">{row.activity}</TableCell>
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
					count={trainings.length}
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
			<AddTraining open={open} setOpen={setOpen} addTraining={addTraining} />
		</div>
	);
};

export default Trainings;
