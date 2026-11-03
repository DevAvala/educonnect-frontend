import { Bell, CalendarCheck, FileText } from "lucide-react";
const labels = {
	administration: "School overview",
	academics: "Assessment overview",
	communication: "School updates",
	analytics: "Performance overview"
};
const stats = [
  { label: "Students", value: "248" },
  { label: "Classes", value: "12" },
  { label: "Attendance", value: "94%" },
];
const attendance = [
	{
		day: "Mon",
		fullDay: "Monday",
		value: 92
	},
	{
		day: "Tue",
		fullDay: "Tuesday",
		value: 88
	},
	{
		day: "Wed",
		fullDay: "Wednesday",
		value: 96
	},
	{
		day: "Thu",
		fullDay: "Thursday",
		value: 90
	},
	{
		day: "Fri",
		fullDay: "Friday",
		value: 94
	}
];
function AttendanceChart() {
	const average = Math.round(attendance.reduce((sum, item) => sum + item.value, 0) / attendance.length);
	const points = attendance.map((item, index) => ({
		...item,
		x: 46 + index * 72,
		y: 70 - (item.value - 80) * 2.25
	}));
	return <div className="preview-card attendance-card">
      <div className="attendance-heading">
        <div>
          <strong>Attendance trend</strong>
          <p>Attendance by day</p>
        </div>
        <div className="attendance-average">
          <span>Weekly average</span>
          <strong>{average}%</strong>
        </div>
      </div>
      <div className="attendance-chart-wrap">
        <svg className="attendance-chart" viewBox="0 0 380 95" role="img" aria-label={`Daily attendance: ${attendance.map(({ fullDay, value }) => `${fullDay} ${value} percent`).join(", ")}. Weekly average: ${average} percent.`}>
          {[
		100,
		90,
		80
	].map((tick) => {
		const y = 70 - (tick - 80) * 2.25;
		return <g key={tick}>
                <text x="0" y={y + 4} className="attendance-axis-label">
                  {tick}%
                </text>
                <line x1="34" x2="370" y1={y} y2={y} className="attendance-grid-line" />
              </g>;
	})}
          <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} className="attendance-line" />
          {points.map((point, index) => <g key={point.fullDay}>
              <circle cx={point.x} cy={point.y} r="5" className={index === 2 ? "attendance-point attendance-point--high" : "attendance-point"} />
              <text x={point.x} y={point.y - 12} textAnchor="middle" className="attendance-value-label">
                {point.value}%
              </text>
              <text x={point.x} y="90" textAnchor="middle" className="attendance-day-label">
                {point.day}
              </text>
            </g>)}
        </svg>
      </div>
      <ul className="attendance-values" aria-label="Attendance by day">
        {attendance.map(({ day, fullDay, value }, index) => <li className={index === 2 ? "attendance-value-item attendance-value-item--high" : "attendance-value-item"} key={day}>
            <abbr aria-label={fullDay} title={fullDay}>
              {day}
            </abbr>
            <strong>{value}%</strong>
          </li>)}
      </ul>
    </div>;
}
function RecordList({ academic = false }) {
	return <div className="preview-card record-card">
      <div className="preview-card-heading">
        <span>{academic ? "Assessment records" : "Class records"}</span>

      </div>
      <div className="record-table" role="table" aria-label={academic ? "Assessment records" : "Class records"}>
        <div className="record-row record-row--head" role="row">
          <span role="columnheader">{academic ? "Subject" : "Class"}</span>
          <span role="columnheader">{academic ? "Records" : "Students"}</span>
          <span role="columnheader">Status</span>
        </div>
        {(academic ? [
		[
			"Mathematics",
			"24 / 24",
			"Ready"
		],
		[
			"English",
			"24 / 24",
			"Ready"
		],
		[
			"Basic Science",
			"18 / 24",
			"In progress"
		]
	] : [
		[
			"Primary 4",
			"24",
			"Organised"
		],
		[
			"Primary 5",
			"28",
			"Organised"
		],
		[
			"Primary 6",
			"26",
			"Organised"
		]
	]).map((row) => <div className="record-row" role="row" key={row[0]}>
            <span role="cell">{row[0]}</span>
            <span role="cell">{row[1]}</span>
            <span role="cell">
              <span className={`status-tag ${row[2] === "In progress" ? "status-tag--gold" : ""}`}>
                {row[2]}
              </span>
            </span>
          </div>)}
      </div>
    </div>;
}
function Notices() {
	return <div className="preview-card notices-card">
      <div className="preview-card-heading">
        <span>School notices</span>
        <Bell size={14} aria-hidden="true" />
      </div>
      {[{
		icon: CalendarCheck,
		title: "Parent meeting",
		text: "School activity update"
	}, {
		icon: FileText,
		title: "Term reports",
		text: "Academic progress update"
	}].map(({ icon: Icon, title, text }) => <div className="notice" key={title}>
          <span className="notice-icon">
            <Icon size={16} aria-hidden="true" />
          </span>
          <div>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        </div>)}

    </div>;
}
export function DashboardPreview({ view = "administration" }) {
	return <figure className="dashboard-frame dashboard-frame--embedded" aria-label={`${labels[view]} dashboard`}>
      <div className="dashboard-body">
        <div className="dashboard-content">
          {view === "administration" && <>
              <div className="preview-stats">
                {stats.map(({ label, value }) => <div className="stat" key={label}>
                    <span className="stat-label">{label}</span>
                    <strong>{value}</strong>
                  </div>)}
              </div>
              <div className="preview-two-col">
                <AttendanceChart />
              </div>
              <RecordList />
            </>}
          {view === "academics" && <RecordList academic />}
          {view === "communication" && <Notices />}
          {view === "analytics" && <AttendanceChart />}
        </div>
      </div>
    </figure>;
}
