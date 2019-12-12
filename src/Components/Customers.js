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

import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import CustomerDetails from "./CustomerDetails";

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
	const [detailsOpen, setDetailsOpen] = React.useState(false);
	const [selectedCustomer, setSelectedCustomer] = React.useState(null);
	const [detailsMode, setDetailsMode] = React.useState("edit");

	React.useEffect(_ => {
		fetchCustomers();
	}, []);

	const fetchCustomers = _ => {
		let customers = [];
		fetch("https://customerrest.herokuapp.com/api/customers")
			.then(resp => resp.json())
			.then(function(data) {
				data.content.map(c => customers.push(c));
				setCustomers(customers);
			});
	};

	const editCustomer = customer => {
		fetch(customer.links[0].href, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(customer)
		})
			.then(resp => resp.json())
			.then(function() {
				fetchCustomers();
			});
	};

	const addCustomer = customer => {
		fetch("https://customerrest.herokuapp.com/api/customers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(customer)
		})
			.then(resp => resp.json())
			.then(function() {
				fetchCustomers();
			});
	};

	const deleteCustomers = _ => {
		selected.forEach(c => {
			fetch(c.links[0].href, {
				method: "DELETE"
			}).then(function() {
				fetchCustomers();
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

	const rowClick = customer => {
		setSelectedCustomer(customer);
		setDetailsOpen(true);
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
					deleteCustomers={deleteCustomers}
					setDetailsOpen={setDetailsOpen}
					setDetailsMode={setDetailsMode}
					title="Customers"
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
												onClick={event =>
													event.target.type !== "checkbox"
														? rowClick(row)
														: null
												}
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.email}
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
			{selectedCustomer !== null || detailsMode === "add" ? (
				<CustomerDetails
					customer={selectedCustomer}
					open={detailsOpen}
					setOpen={setDetailsOpen}
					editCustomer={editCustomer}
					setSelectedCustomer={setSelectedCustomer}
					detailsMode={detailsMode}
					setDetailsMode={setDetailsMode}
					addCustomer={addCustomer}
				/>
			) : null}
		</div>
	);
}
