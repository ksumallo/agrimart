import PropTypes from "prop-types";

function ViewUserSidebar(props) {
	return (
		<>
			<aside className="sidebar">
				<div className="header">User Details</div>
				<div className="body">
					<div className="flex flex-col w-full">
						<div className="heading3 text-white">User Id</div>
						<div className="info-user">{props.selectedUser._id}</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="heading3 text-white">First name</div>
						<div className="info-user">{props.selectedUser.fname}</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="heading3 text-white">Middle Name</div>
						<div className="info-user">{props.selectedUser.mname}</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="heading3 text-white">Last Name</div>
						<div className="info-user">{props.selectedUser.lname}</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="heading3 text-white">Email</div>
						<div className="info-user">{props.selectedUser.email}</div>
					</div>
				</div>
				<div className="action"></div>
			</aside>
		</>
	);
}

ViewUserSidebar.propTypes = {
	selectedUser: PropTypes.object,
};

export default ViewUserSidebar;
