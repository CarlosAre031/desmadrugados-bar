'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { RefreshCw } from 'lucide-react'

// 100+ frases típicas de bar colombianas y universales
const FRASES_ES = [
  // Clásicos de cantina
  'La primera es por salud, la segunda por amistad, y la tercera... porque sí.',
  '¡Salud, amor, dinero y tiempo para gastarlo!',
  'El que no arriesga un huevo, no consigue un pollo.',
  'Barriga llena, corazón contento.',
  'A palabras necias, oídos sordos... y otro trago.',
  'El que con lobos anda, a aullar aprende... y a tomar también.',
  'Más vale borracho conocido que alcohólico anónimo.',
  'Entre broma y broma, la cerveza se asoma.',
  'Dios puso el trago para que los feos también tuvieran chance.',
  'El alcohol no soluciona problemas, pero tampoco la leche.',

  // Frases de amistad
  'Los verdaderos amigos no se cuentan, se brindan.',
  'Amigo que no presta, ¿pa\' qué se acuesta?',
  'El amigo que no te invita un trago, no es amigo.',
  'La amistad se mide en cervezas compartidas.',
  'Mejor un amigo borracho que un enemigo sobrio.',
  'Los mejores recuerdos empiezan con "¿vamos por una?"',
  'Amigos son los que te aguantan borracho.',
  'El mejor psicólogo es un amigo con dos cervezas.',
  'La vida es corta, pero las noches con amigos son largas.',
  'Un brindis por los que están, por los que se fueron, y por los que van a llegar.',

  // Filosofía de cantina
  'La vida es como el tequila: a veces te hace llorar.',
  'El trago no te cambia, te revela.',
  'La cerveza es prueba de que Dios nos ama.',
  'El alcohol mata, pero yo nací inmortal.',
  'No es que sea alcohólico, es que soy muy sociable.',
  'El hígado se regenera, pero las penas no.',
  'Mejor una cerveza en la mano que dos en el refrigerador.',
  'El único lugar donde no hay crisis es en el bar.',
  'La vida es demasiado corta para tomar mal trago.',
  'Bebo para olvidar... ¿qué era? Ya no me acuerdo.',

  // Dichos populares
  'Pa\' las que sea, con cerveza.',
  'De noche todos los gatos son pardos... y todos los tragos son buenos.',
  'Donde caben dos, caben tres... y cuatro cervezas.',
  'No hay mal que por cerveza no venga.',
  'Al mal tiempo, buena cerveza.',
  'Quien ríe de último, es porque le tocó pagar la cuenta.',
  'La paciencia es virtud... de los que esperan su cerveza.',
  'El que madruga, Dios lo ayuda... pero el que trasnocha, se la pasa mejor.',
  'Más vale pájaro en mano que cien volando... a menos que vuelen cervezas.',
  'Camarón que se duerme, se lo lleva la resaca.',

  // Frases de amor y cantina
  'El amor es ciego, pero el cantinero ve todo.',
  'En el amor y en el trago, el primero es el que cuenta.',
  'El amor se va, pero la resaca se queda.',
  'Brindo por mi ex: gracias por darme historias para contar en el bar.',
  'El amor de mi vida es la cerveza: nunca me falla.',
  'Hay amores que matan... y tragos que reviven.',
  'El corazón tiene razones que el hígado no entiende.',
  'El amor es como el tequila: quema al principio, pero luego te acostumbras.',
  'Mejor solo que mal acompañado... pero mejor acompañado en el bar.',
  'El alcohol y el amor se parecen: ambos te hacen hacer tonterías.',

  // Sabiduría de bar
  'La cerveza fría y los amigos cerca.',
  'El secreto de la felicidad está en el fondo de la copa.',
  'La vida es un carnaval, pero el bar es la fiesta.',
  'Si la vida te da limones, pide sal y tequila.',
  'El que nace pa\' maceta, del corredor no pasa... pero del bar tampoco.',
  'No me importa lo que piensen, mientras me sirvan.',
  'El silencio es oro, pero un brindis es platino.',
  'La moderación es buena, pero no en exceso.',
  'El mejor remedio para todo es un buen trago.',
  'Más vale prevenir que curar... la resaca.',

  // Frases para brindar
  '¡Arriba, abajo, al centro y pa\' dentro!',
  '¡Por nosotros, que somos los mejores!',
  '¡Salud, pesetas y amor... y tiempo para gozarlos!',
  '¡Por los que están, por los que no están, y por los que vendrán!',
  '¡Que viva la fiesta!',
  '¡Por la amistad, que nunca se acabe!',
  '¡Chin chin!',
  '¡Fondo, fondo, fondo!',
  '¡Por esta noche que apenas empieza!',
  '¡Por los presentes y los ausentes!',

  // Humor de cantina
  'No estoy borracho, solo muy feliz.',
  'El agua es para los peces, yo prefiero la cerveza.',
  'Si me ven tomando, es que estoy hidratándome.',
  'No es alcoholismo si es cultura.',
  'Vengo a tomarme las penas... y las cervezas.',
  'El gimnasio puede esperar, el bar no.',
  'No es vicio, es hobbie.',
  'Mi único ejercicio es levantar el vaso.',
  'No soy alcohólico, soy coleccionista de bebidas.',
  'La dieta empieza mañana, hoy hay happy hour.',

  // Frases colombianas
  '¡Qué chimba de noche!',
  'Esto está más bueno que una cerveza fría en un día de calor.',
  'Parcero que no toma, no es parcero.',
  '¡Nos dañamos la rumba, pues!',
  'El que se fue para Barranquilla perdió su silla... y su cerveza.',
  'Aquí se habla de todo, menos de trabajo.',
  'A beber que el mundo se va a acabar.',
  'Más colombiano que el aguardiente.',
  'Esta ronda la pago yo, la otra la pagas tú.',
  'El mejor plan es donde hay cerveza.',

  // Más filosofía
  'En vino hay verdad, en cerveza hay alegría.',
  'El bar es el único lugar donde las penas flotan.',
  'La vida sin fiestas es como un año sin verano.',
  'El que no ha amanecido en un bar, no conoce la vida.',
  'Tomar no es un problema, es una solución temporal.',
  'El mejor consejo se da con una copa en la mano.',
  'La magia existe: un trago y los problemas desaparecen.',
  'Brindo porque mañana seré mejor persona... pero hoy, a tomar.',
  'El dinero va y viene, pero el bar siempre está.',
  'No hay edad para divertirse, solo hay edad para pagar la entrada.',

  // Cierre de noche
  '¿La última? Eso dijiste hace tres tragos.',
  'Solo una más... dijo nadie nunca.',
  'La noche es joven, como nosotros ya no.',
  'Mañana hay trabajo, pero hoy hay rumba.',
  'El reloj dice que es tarde, pero mi corazón dice que es temprano.',
  'La cuenta, por favor... es broma, otra ronda.',
  'Ya casi nos vamos... después de esta.',
  'La última cerveza es como el último adiós: siempre hay otra.',
  'Esta noche no termina hasta que el bar cierre.',
  'Si la noche sigue, ¿por qué nosotros vamos a parar?',
]

// English translations (subset for fallback)
const FRASES_EN = [
  'The first drink is for health, the second for friendship, and the third... just because.',
  'Cheers to health, love, money, and time to enjoy them!',
  'Life is like tequila: sometimes it makes you cry.',
  'The drink doesn\'t change you, it reveals you.',
  'Beer is proof that God loves us.',
  'True friends aren\'t counted, they\'re toasted.',
  'The best memories start with "want to grab a drink?"',
  'Friends are those who tolerate you drunk.',
  'The best psychologist is a friend with two beers.',
  'If life gives you lemons, ask for salt and tequila.',
  'I\'m not drunk, just very happy.',
  'Water is for fish, I prefer beer.',
  'Bottoms up!',
  'To those here, those gone, and those yet to come!',
  'The party ain\'t over until the bar closes.',
  'One more... said no one ever.',
  'Tomorrow is work, but tonight is party.',
  'The clock says it\'s late, but my heart says it\'s early.',
  'The night is young, unlike us.',
  'Beer: the cause of, and solution to, all of life\'s problems.',
]

export default function BarPhrases() {
  const { lang } = useLanguage()
  const [phrase, setPhrase] = useState<string>('')
  const [fadeIn, setFadeIn] = useState(true)
  const list = lang === 'es' ? FRASES_ES : FRASES_EN

  const getRandomPhrase = () => {
    setFadeIn(false)
    setTimeout(() => {
      setPhrase(list[Math.floor(Math.random() * list.length)])
      setFadeIn(true)
    }, 200)
  }

  useEffect(() => {
    setPhrase(list[Math.floor(Math.random() * list.length)])
  }, [lang])

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const interval = setInterval(getRandomPhrase, 10000)
    return () => clearInterval(interval)
  }, [lang])

  return (
    <section className="py-16 bg-background border-t border-b border-border/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
          {lang === 'es' ? 'Sabiduría de cantina' : 'Bar wisdom'}
        </p>
        <blockquote
          className={`font-heading text-2xl sm:text-3xl md:text-4xl text-[#D4A017] leading-tight min-h-[80px] flex items-center justify-center transition-opacity duration-200 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          "{phrase}"
        </blockquote>
        <button
          onClick={getRandomPhrase}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground border border-border rounded hover:border-[#D4A017] hover:text-[#D4A017] transition-colors"
        >
          <RefreshCw size={12} />
          {lang === 'es' ? 'Otra frase' : 'Another phrase'}
        </button>
        <p className="mt-4 text-xs text-muted-foreground/50">
          {lang === 'es' ? `${FRASES_ES.length} frases típicas de bar` : `${FRASES_EN.length} classic bar phrases`}
        </p>
      </div>
    </section>
  )
}
