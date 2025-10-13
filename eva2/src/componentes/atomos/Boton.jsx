export default function Boton({ texto, onClick, tipo = "button" }) {
  return (
    <button className="boton" type={tipo} onClick={onClick}>
      {texto}
    </button>
  );
}
