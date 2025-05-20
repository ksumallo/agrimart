import PropTypes from "prop-types";

function FormSelectInput(props) {
	return (
		<div className="input-field">
			<label htmlFor={props.fieldname} className="heading3  text-white">
				{props.label}
			</label>
			<div></div>
			<select name={props.fieldname} className="p-[0.5rem] rounded-2xl" value={props.value} onChange={(e) => props.onChange(e.target.value)} id={`${props.object._id}-category`}>
				{props.options.map((option) =>
					option._id == props.object.type ? (
						<option key={option._id} value={option.category}>
							{option.category}
						</option>
					) : (
						<option key={option._id} value={option.category}>
							{option.category}
						</option>
					)
				)}
			</select>
		</div>
	);
}

FormSelectInput.propTypes = {
	fieldname: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.any,
	options: PropTypes.array,
	object: PropTypes.object,
	onChange: PropTypes.func,
};

export default FormSelectInput;
