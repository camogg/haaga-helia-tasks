import React, { useState, useEffect } from "react";
import "react-table/react-table.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";

const Calendar = () => {
	const [trainings, setTraining] = useState([]);

	useEffect(() => {
		fetchTrainings();
	}, []);

	const fetchTrainings = () => {
		let trainingInter = [];
		fetch("https://customerrest.herokuapp.com/api/trainings")
			.then(response => response.json())
			.then(data => {
				data.content.forEach(element => {
					var dStart = new Date(element.date);
					var dEnd = new Date(element.date);
					//Add duration
					dEnd.setHours(
						dEnd.getHours(),
						dEnd.getMinutes() + element.duration,
						0,
						0
					);
					//Push to array
					trainingInter.push({
						title: element.activity,
						start: dStart,
						end: dEnd
					});
				});
			})
			.then(data => setTraining(trainingInter))
			.catch(err => console.error(err));
	};

	return (
		<div>
			<FullCalendar
				plugins={[dayGridPlugin]}
				header={{ center: "dayGridMonth,dayGridWeek,dayGridDay" }}
				events={trainings}
			/>
		</div>
	);
};

export default Calendar;
