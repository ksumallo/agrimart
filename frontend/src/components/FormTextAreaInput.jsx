import PropTypes from "prop-types";

function FormTextAreaInput(props) {
	return (
		<div className="input-field">
			<label htmlFor={props.fieldname} className="heading3  text-white">
				{props.label}
			</label>
			<textarea name={props.fieldname} className="w-full min-h-[7rem] max-h-[7rem] p-[0.5rem] text-md h-full rounded-2xl " type="text" value={props.value} onChange={(e) => props.onChange(e.target.value)} id={`${props.id}-${props.fieldname}`} />
		</div>
	);
}

FormTextAreaInput.propTypes = {
	fieldname: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default FormTextAreaInput;
