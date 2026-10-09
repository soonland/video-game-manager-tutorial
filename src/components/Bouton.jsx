// Les classes sont écrites en entier : Tailwind ne détecte pas un nom construit par morceaux.
const VARIANTES = {
  principal: 'border-violet-500 bg-violet-500 text-white hover:bg-violet-400',
  secondaire: 'border-violet-500 bg-transparent text-violet-300 hover:bg-violet-500/10',
  danger: 'border-rose-500 bg-transparent text-rose-400 hover:bg-rose-500/10',
}

function Bouton({ variante = 'principal', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-md border px-3.5 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  )
}

export default Bouton
