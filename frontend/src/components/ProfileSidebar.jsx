import PropTypes from "prop-types";
import SpaceFiller from "./SpaceFiller";
import DAImage from "../assets/DA.png";
import LOGO from "../assets/LOGO.png";
import BROWSE from "../assets/BROWSE.png";
import PURCHASE from "../assets/PURCHASE.png";
import MANAGE from "../assets/MANAGE.png";

function ProfileSidebar(props) {
	return (
		<>
			<aside className="flex bg-gradient-to-b from-white/50 to-green-600/100 backdrop-brightness-200 backdrop-blur-xl rounded-l-2xl shadow-md lg:flex-col md:flex-row pl-[1.25rem] py-[1.25rem] my-[2rem] justify-start items-center gap-[1.25rem] self-stretch">
				<img src={LOGO} className="flex w-[4.5rem] h-[4.5rem] mr-[.25rem] " />
				<div className={props.curr_page != "/profile" ? "sidebar-button" : "selected-sidebar-button"}>
					<a href={props.profile_link}>
						<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="white">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
							<path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
						</svg>
					</a>
				</div>
				<div className={props.curr_page != "/home" ? "sidebar-button" : "selected-sidebar-button"}>
					<a href={props.browse_link}>
						<img src={BROWSE} className="flex w-[4rem] h-[4rem] object-cover p-[0.25rem]" />
					</a>
				</div>
				<div className={props.curr_page != "/orders" ? "sidebar-button" : "selected-sidebar-button"}>
					<a href={props.orders_link}>
						<img src={PURCHASE} className="flex w-[4rem] h-[4rem] object-cover p-[0.25rem] " />
					</a>
				</div>


				{props.accounts_link ? (
					<div className={props.curr_page != "/accounts" ? "sidebar-button" : "selected-sidebar-button"}>
						<a href={props.accounts_link}>
							<img src={MANAGE} className="flex w-[4rem] h-[4rem] object-cover p-[0.25rem] " />
						</a>
					</div>
				) : null}

				<SpaceFiller />
				<img src={DAImage} alt="DA" className="w-[4rem] h-[rem] mr-[.25rem] " />
			</aside>
		</>
	);
}

ProfileSidebar.propTypes = {
	curr_page: PropTypes.string,
	profile_link: PropTypes.string.isRequired,
	browse_link: PropTypes.string.isRequired,
	orders_link: PropTypes.string.isRequired,
	accounts_link: PropTypes.string,
};

export default ProfileSidebar;
