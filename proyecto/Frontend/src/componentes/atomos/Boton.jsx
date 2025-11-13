export default function Boton({ texto, onClick, type = "button", ...rest }) {
  return (
    <button
      className="boton"
      type={type} 
      onClick={onClick}
      {...rest}
    >
      {texto}
    </button>
  );
}
