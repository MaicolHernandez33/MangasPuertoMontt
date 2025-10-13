export default function CampoTexto({
  tipo = "text",
  placeholder = "",
  valor,
  onChange,
}) {
  return (
    <input
      type={tipo}
      className="campo-texto"
      placeholder={placeholder}
      value={valor}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  );
}
