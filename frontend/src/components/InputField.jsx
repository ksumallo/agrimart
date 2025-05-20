
import styles from "../styles/Form.module.css";
function InputField(props) {
  return (
    <>
        <div className={styles.form_field}>
          <div className={styles.label}>{props.label}</div>
          <input className={styles.input_field} type={props.type} id={props.id} name={props.name}></input>
        </div>
    </>
  );
}

export default InputField;
