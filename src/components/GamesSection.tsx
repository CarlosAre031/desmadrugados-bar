'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { RotateCcw, Shuffle, HelpCircle, Users, Wine, Crown, Trash2, Plus, User, Sparkles } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// PICO BOTELLA - Con registro de jugadores
// ═══════════════════════════════════════════════════════════════════
interface Player {
  id: number
  name: string
  gender: 'M' | 'F' | 'X'
}

function PicoBottle() {
  const { lang } = useLanguage()
  const [players, setPlayers] = useState<Player[]>([])
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState<'M' | 'F' | 'X'>('M')
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  const addPlayer = () => {
    if (!newName.trim() || players.length >= 12) return
    setPlayers([...players, { id: Date.now(), name: newName.trim(), gender: newGender }])
    setNewName('')
  }

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id))
  }

  const startGame = () => {
    if (players.length < 2) return
    setGameStarted(true)
    setSelectedPlayer(null)
  }

  const spin = () => {
    if (spinning || players.length < 2) return
    setSpinning(true)
    setSelectedPlayer(null)
    const extra = 1440 + Math.floor(Math.random() * 1080)
    setAngle(a => a + extra)

    setTimeout(() => {
      const selected = players[Math.floor(Math.random() * players.length)]
      setSelectedPlayer(selected)
      setSpinning(false)
    }, 3000)
  }

  const resetGame = () => {
    setGameStarted(false)
    setPlayers([])
    setSelectedPlayer(null)
    setAngle(0)
  }

  const genderColors = { M: '#3B82F6', F: '#EC4899', X: '#8B5CF6' }
  const genderLabels = { M: lang === 'es' ? 'Hombre' : 'Male', F: lang === 'es' ? 'Mujer' : 'Female', X: 'Otro/Other' }

  if (!gameStarted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h3 className="font-heading text-3xl text-gold mb-2">
            {lang === 'es' ? 'Registra a los jugadores' : 'Register players'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'es' ? `${players.length} jugadores (mínimo 2, máximo 12)` : `${players.length} players (min 2, max 12)`}
          </p>
        </div>

        {/* Add player form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPlayer()}
            placeholder={lang === 'es' ? 'Nombre...' : 'Name...'}
            className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm focus:border-gold outline-none"
            maxLength={15}
          />
          <select
            value={newGender}
            onChange={e => setNewGender(e.target.value as 'M' | 'F' | 'X')}
            className="bg-background border border-border rounded px-2 py-2 text-sm focus:border-gold outline-none"
          >
            <option value="M">{lang === 'es' ? '♂ H' : '♂ M'}</option>
            <option value="F">{lang === 'es' ? '♀ M' : '♀ F'}</option>
            <option value="X">⚧ X</option>
          </select>
          <button
            onClick={addPlayer}
            disabled={!newName.trim() || players.length >= 12}
            className="p-2 bg-gold text-black rounded hover:bg-orange-bar disabled:opacity-50 transition-all min-w-[44px]"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Player list */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[60px]">
          {players.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
              style={{ borderColor: genderColors[p.gender], backgroundColor: `${genderColors[p.gender]}15` }}
            >
              <User size={14} style={{ color: genderColors[p.gender] }} />
              <span className="text-foreground">{p.name}</span>
              <button onClick={() => removePlayer(p.id)} className="text-muted-foreground hover:text-red-bar transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          disabled={players.length < 2}
          className="w-full py-4 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar disabled:opacity-50 transition-all"
        >
          {lang === 'es' ? '¡A jugar!' : "Let's play!"}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Players circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Player positions around circle */}
        {players.map((p, i) => {
          const playerAngle = (i / players.length) * 360 - 90
          const rad = (playerAngle * Math.PI) / 180
          const x = Math.cos(rad) * 120
          const y = Math.sin(rad) * 120
          return (
            <div
              key={p.id}
              className={`absolute flex flex-col items-center transition-all duration-300 ${selectedPlayer?.id === p.id ? 'scale-125 z-20' : ''}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 ${selectedPlayer?.id === p.id ? 'ring-4 ring-gold ring-offset-2 ring-offset-background' : ''}`}
                style={{ backgroundColor: genderColors[p.gender], borderColor: genderColors[p.gender] }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-xs mt-1 max-w-[60px] truncate ${selectedPlayer?.id === p.id ? 'text-gold font-bold' : 'text-muted-foreground'}`}>
                {p.name}
              </span>
            </div>
          )
        })}

        {/* Center circle */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-gold/30 bg-card" />

        {/* Bottle */}
        <div
          className="w-4 h-20 rounded-full bg-gradient-to-t from-gold to-orange-bar relative z-10"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: spinning ? 'transform 3s cubic-bezier(0.17,0.67,0.12,1)' : 'none',
            transformOrigin: '50% 100%',
            marginTop: '-40px',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-5 rounded-full bg-[#8B6914]" />
        </div>

        {/* Center dot */}
        <div className="absolute w-5 h-5 rounded-full bg-gold z-20" style={{ marginTop: '40px' }} />
      </div>

      {/* Selected player announcement */}
      {selectedPlayer && (
        <div className="text-center animate-pulse">
          <p className="text-sm text-muted-foreground mb-1">{lang === 'es' ? '¡Le tocó a...' : 'It landed on...'}</p>
          <p className="font-heading text-4xl" style={{ color: genderColors[selectedPlayer.gender] }}>
            {selectedPlayer.name}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-3 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar disabled:opacity-50 transition-all min-h-[44px]"
        >
          {spinning ? '...' : lang === 'es' ? 'Girar' : 'Spin'}
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-3 border border-border rounded hover:border-red-bar hover:text-red-bar transition-all"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// NUNCA NUNCA - Never Have I Ever
// ═══════════════════════════════════════════════════════════════════
const NUNCA_ES = [
  'Nunca he besado a alguien de este grupo',
  'Nunca he mentido sobre mi edad para entrar a un bar',
  'Nunca he enviado un mensaje a mi ex borracho/a',
  'Nunca me he quedado dormido/a en un bar',
  'Nunca he fingido que me gustaba una canción para impresionar a alguien',
  'Nunca he vomitado por tomar mucho',
  'Nunca he ligado con alguien del trabajo',
  'Nunca he bailado en una mesa',
  'Nunca me he escapado sin pagar',
  'Nunca he tenido una pelea en un bar',
  'Nunca he llorado por una canción estando ebrio/a',
  'Nunca he perdido mi celular en una fiesta',
  'Nunca he llamado a mi mamá/papá borracho/a',
  'Nunca he comido algo del piso',
  'Nunca he besado a un desconocido',
  'Nunca he robado un vaso del bar',
  'Nunca he cantado karaoke horrible',
  'Nunca me han sacado de un bar',
  'Nunca he hecho algo de lo que me arrepentí al día siguiente',
  'Nunca he mezclado más de 3 tipos de alcohol en una noche',
]

const NUNCA_EN = [
  'Never have I ever kissed someone in this group',
  'Never have I ever lied about my age to get into a bar',
  'Never have I ever drunk texted my ex',
  'Never have I ever fallen asleep at a bar',
  'Never have I ever pretended to like a song to impress someone',
  'Never have I ever thrown up from drinking too much',
  'Never have I ever hooked up with a coworker',
  'Never have I ever danced on a table',
  'Never have I ever dined and dashed',
  'Never have I ever been in a bar fight',
  'Never have I ever cried over a song while drunk',
  'Never have I ever lost my phone at a party',
  'Never have I ever drunk called my parents',
  'Never have I ever eaten something off the floor',
  'Never have I ever kissed a stranger',
  'Never have I ever stolen a glass from a bar',
  'Never have I ever sung terrible karaoke',
  'Never have I ever been kicked out of a bar',
  'Never have I ever done something I regretted the next day',
  'Never have I ever mixed more than 3 types of alcohol in one night',
]

function NuncaNunca() {
  const { lang } = useLanguage()
  const [current, setCurrent] = useState<string | null>(null)
  const [used, setUsed] = useState<number[]>([])
  const list = lang === 'es' ? NUNCA_ES : NUNCA_EN

  const next = () => {
    const available = list.map((_, i) => i).filter(i => !used.includes(i))
    if (available.length === 0) {
      setUsed([])
      const idx = Math.floor(Math.random() * list.length)
      setCurrent(list[idx])
      setUsed([idx])
    } else {
      const idx = available[Math.floor(Math.random() * available.length)]
      setCurrent(list[idx])
      setUsed([...used, idx])
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
      {current && (
        <div className="border border-red-bar/40 rounded-lg p-6 bg-card">
          <p className="font-heading text-2xl text-red-bar leading-tight">{current}</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {lang === 'es' ? 'Los que SÍ lo hayan hecho, ¡toman!' : 'Those who HAVE done it, drink!'}
      </p>
      <button
        onClick={next}
        className="px-8 py-3 font-heading text-2xl tracking-wider bg-red-bar text-white rounded hover:bg-orange-bar transition-all min-h-[44px]"
      >
        {lang === 'es' ? 'Siguiente' : 'Next'}
      </button>
      <p className="text-xs text-muted-foreground">
        {used.length}/{list.length}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// VERDAD O TRAGO - Truth or Drink
// ═══════════════════════════════════════════════════════════════════
const VERDAD_ES = [
  '¿Cuál es tu secreto más vergonzoso?',
  '¿Quién de los presentes te parece más atractivo/a?',
  '¿Cuál fue tu momento más incómodo en una cita?',
  '¿Has stalkeado a alguien en redes sociales?',
  '¿Cuál es la mentira más grande que has dicho?',
  '¿Qué es lo más raro que has buscado en Google?',
  '¿Has tenido un crush con el/la mejor amigo/a de tu ex?',
  '¿Cuál es tu fantasía más loca?',
  '¿Qué es lo más ilegal que has hecho?',
  '¿Has fingido estar enfermo/a para no ir a trabajar?',
  '¿Cuántas personas has besado en tu vida?',
  '¿Qué es lo más estúpido que has hecho estando borracho/a?',
  '¿Has hablado mal de alguien presente aquí?',
  '¿Cuál es tu mayor inseguridad?',
  '¿Qué es lo peor que te han dicho en una ruptura?',
]

const VERDAD_EN = [
  'What is your most embarrassing secret?',
  'Who here do you find most attractive?',
  'What was your most awkward date moment?',
  'Have you ever stalked someone on social media?',
  'What is the biggest lie you have ever told?',
  'What is the weirdest thing you have Googled?',
  'Have you ever had a crush on your ex\'s best friend?',
  'What is your craziest fantasy?',
  'What is the most illegal thing you have done?',
  'Have you ever faked being sick to skip work?',
  'How many people have you kissed in your life?',
  'What is the dumbest thing you have done while drunk?',
  'Have you talked bad about someone who is here?',
  'What is your biggest insecurity?',
  'What is the worst thing someone said during a breakup?',
]

function VerdadOTrago() {
  const { lang } = useLanguage()
  const [current, setCurrent] = useState<string | null>(null)
  const list = lang === 'es' ? VERDAD_ES : VERDAD_EN

  const next = () => {
    setCurrent(list[Math.floor(Math.random() * list.length)])
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
      {current && (
        <div className="border border-orange-bar/40 rounded-lg p-6 bg-card">
          <p className="font-heading text-2xl text-orange-bar leading-tight">{current}</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {lang === 'es' ? '¿Responde honestamente o toma un trago?' : 'Answer honestly or take a shot?'}
      </p>
      <button
        onClick={next}
        className="px-8 py-3 font-heading text-2xl tracking-wider bg-orange-bar text-white rounded hover:bg-red-bar transition-all min-h-[44px]"
      >
        {lang === 'es' ? 'Sacar pregunta' : 'Draw question'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// REY DE LA MESA - King of the Table
// ═══════════════════════════════════════════════════════════════════
const REY_ES = [
  'El Rey ordena: todos toman un trago menos el Rey',
  'El Rey pregunta: el que no sepa la respuesta, toma',
  'El Rey elige: escoge a alguien para que tome doble',
  'Waterfall: el Rey empieza a tomar y nadie puede parar hasta que él pare',
  'El Rey crea una regla nueva para el resto del juego',
  'El Rey puede hacer que dos personas brinden juntas',
  'El Rey elige: ¿quién cuenta el mejor chiste? El peor, toma',
  'El Rey dice: todos imitan al Rey por 1 minuto',
  'El Rey perdona: una persona no tiene que tomar esta ronda',
  'El Rey desafía: pulso con alguien, el que pierda toma',
  'El Rey interroga: elige a alguien y hazle 3 preguntas, si se niega, toma',
  'El Rey intercambia: cambia de bebida con alguien por una ronda',
]

const REY_EN = [
  'The King orders: everyone drinks except the King',
  'The King asks: whoever doesn\'t know the answer, drinks',
  'The King chooses: pick someone to drink double',
  'Waterfall: King starts drinking and no one can stop until he does',
  'The King creates a new rule for the rest of the game',
  'The King can make two people toast together',
  'The King chooses: who tells the best joke? The worst one drinks',
  'The King says: everyone imitates the King for 1 minute',
  'The King forgives: one person doesn\'t have to drink this round',
  'The King challenges: arm wrestle someone, loser drinks',
  'The King interrogates: choose someone and ask 3 questions, if they refuse, they drink',
  'The King swaps: switch drinks with someone for one round',
]

function ReyDeLaMesa() {
  const { lang } = useLanguage()
  const [current, setCurrent] = useState<string | null>(null)
  const [hasKing, setHasKing] = useState(false)
  const list = lang === 'es' ? REY_ES : REY_EN

  const crownKing = () => {
    setHasKing(true)
    setCurrent(null)
  }

  const drawChallenge = () => {
    setCurrent(list[Math.floor(Math.random() * list.length)])
  }

  const abdicate = () => {
    setHasKing(false)
    setCurrent(null)
  }

  if (!hasKing) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Crown size={48} className="text-gold" />
        <p className="text-sm text-muted-foreground max-w-xs">
          {lang === 'es'
            ? 'Alguien debe ser el Rey de la Mesa. El Rey tiene el poder absoluto... por ahora.'
            : 'Someone must be the King of the Table. The King has absolute power... for now.'}
        </p>
        <button
          onClick={crownKing}
          className="px-8 py-3 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[44px]"
        >
          {lang === 'es' ? '¡Coronar al Rey!' : 'Crown the King!'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Crown size={24} className="text-gold" />
        <span className="font-heading text-xl text-gold">{lang === 'es' ? 'El Rey manda' : 'The King commands'}</span>
      </div>

      {current && (
        <div className="border border-gold/40 rounded-lg p-6 bg-card">
          <p className="font-heading text-2xl text-gold leading-tight">{current}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={drawChallenge}
          className="px-6 py-3 font-heading text-xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[44px]"
        >
          {lang === 'es' ? 'Sacar orden' : 'Draw order'}
        </button>
        <button
          onClick={abdicate}
          className="px-4 py-3 border border-red-bar/50 text-red-bar rounded hover:bg-red-bar hover:text-white transition-all text-sm"
        >
          {lang === 'es' ? 'Abdicar' : 'Abdicate'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// JUEGO DE TAPAS - Caps Game
// ═══════════════════════════════════════════════════════════════════
function JuegoDeTapas() {
  const { lang } = useLanguage()
  const [caps, setCaps] = useState<number | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const newRound = () => {
    setCaps(Math.floor(Math.random() * 10) + 1)
    setGuess('')
    setResult(null)
  }

  const check = () => {
    if (!caps || !guess) return
    const g = parseInt(guess)
    if (g === caps) {
      setResult(lang === 'es' ? `✓ ¡Correcto! Eran ${caps} tapas.` : `✓ Correct! It was ${caps} caps.`)
    } else {
      setResult(lang === 'es' ? `✗ Eran ${caps} tapas. ¡Toma!` : `✗ It was ${caps} caps. Drink!`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {caps === null ? (
        <button
          onClick={newRound}
          className="px-8 py-3 font-heading text-2xl tracking-wider bg-red-bar text-white rounded hover:bg-orange-bar transition-all min-h-[44px]"
        >
          {lang === 'es' ? 'Nuevo juego' : 'New game'}
        </button>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">{lang === 'es' ? '¿Cuántas tapas hay?' : 'How many caps?'}</p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-20 text-center text-2xl font-heading bg-card border border-border rounded p-2 focus:border-gold outline-none text-foreground"
              placeholder="?"
            />
            <button
              onClick={check}
              className="px-6 py-2 font-heading text-xl bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[44px]"
            >
              OK
            </button>
          </div>
          {result && (
            <div className={`text-center font-heading text-xl px-4 py-2 rounded ${result.startsWith('✓') ? 'text-green-400' : 'text-red-bar'}`}>
              {result}
            </div>
          )}
          <button onClick={newRound} className="text-xs text-muted-foreground hover:text-gold mt-2 transition-colors">
            {lang === 'es' ? 'Nuevo juego' : 'New game'}
          </button>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RETOS GRUPALES - Group Challenges
// ═══════════════════════════════════════════════════════════════════
const RETOS_ES = [
  'El que pierda toma un trago doble.',
  'Todos toman menos el ganador.',
  'Confiesa algo que nunca hayas dicho aquí.',
  'Imita a alguien del grupo por 30 segundos.',
  'El de a la derecha te pone la bebida.',
  'Haz una promesa y cúmplela antes de que acabe la noche.',
  'Todos cantan el coro de una canción que elija el grupo.',
  'Toma sin usar las manos.',
  'Habla en susurros por los próximos 5 minutos.',
  'El que ría primero toma.',
  'Di un brindis para alguien del grupo.',
  'Cambia de lugar con la persona de tu izquierda.',
  'Cuenta tu peor cita en 30 segundos.',
  'Baila 10 segundos solo.',
  'Di algo bonito de cada persona en la mesa.',
  'El grupo decide: ¿tomas 1 o haces 10 sentadillas?',
]

const RETOS_EN = [
  'Loser takes a double shot.',
  'Everyone drinks except the winner.',
  'Confess something you have never said here.',
  'Imitate someone from the group for 30 seconds.',
  'The person to your right pours your drink.',
  'Make a promise and keep it before the night is over.',
  'Everyone sings the chorus of a song the group picks.',
  'Drink without using your hands.',
  'Speak in whispers for the next 5 minutes.',
  'First one to laugh takes a drink.',
  'Give a toast to someone in the group.',
  'Switch seats with the person to your left.',
  'Tell your worst date story in 30 seconds.',
  'Dance alone for 10 seconds.',
  'Say something nice about everyone at the table.',
  'The group decides: take 1 shot or do 10 squats?',
]

function RetosGrupales() {
  const { lang } = useLanguage()
  const [challenge, setChallenge] = useState<string | null>(null)
  const list = lang === 'es' ? RETOS_ES : RETOS_EN

  const draw = () => {
    setChallenge(list[Math.floor(Math.random() * list.length)])
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {challenge && (
        <div className="border border-orange-bar/40 rounded p-4 bg-card max-w-xs">
          <p className="font-heading text-2xl text-orange-bar leading-tight">{challenge}</p>
        </div>
      )}
      <button
        onClick={draw}
        className="px-8 py-3 font-heading text-2xl tracking-wider bg-orange-bar text-white rounded hover:bg-red-bar transition-all min-h-[44px]"
      >
        {lang === 'es' ? 'Sacar reto' : 'Draw challenge'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN GAMES SECTION
// ═══════════════════════════════════════════════════════════════════
type GameTab = 'bottle' | 'nunca' | 'verdad' | 'rey' | 'caps' | 'retos'

export default function GamesSection() {
  const { lang } = useLanguage()
  const [active, setActive] = useState<GameTab>('bottle')

  const tabs: { id: GameTab; label: string; icon: React.ReactNode }[] = [
    { id: 'bottle', label: lang === 'es' ? 'Pico Botella' : 'Spin the Bottle', icon: <RotateCcw size={16} /> },
    { id: 'nunca', label: lang === 'es' ? 'Nunca Nunca' : 'Never Have I', icon: <Wine size={16} /> },
    { id: 'verdad', label: lang === 'es' ? 'Verdad o Trago' : 'Truth or Drink', icon: <Sparkles size={16} /> },
    { id: 'rey', label: lang === 'es' ? 'Rey de la Mesa' : 'King of Table', icon: <Crown size={16} /> },
    { id: 'caps', label: lang === 'es' ? 'Tapas' : 'Caps', icon: <HelpCircle size={16} /> },
    { id: 'retos', label: lang === 'es' ? 'Retos' : 'Challenges', icon: <Shuffle size={16} /> },
  ]

  const descriptions: Record<GameTab, { es: string; en: string }> = {
    bottle: { es: 'Registra jugadores, gira la botella y que el destino decida.', en: 'Register players, spin the bottle, and let fate decide.' },
    nunca: { es: 'Si lo has hecho, ¡tomas!', en: 'If you have done it, drink!' },
    verdad: { es: '¿Respondes o tomas?', en: 'Do you answer or drink?' },
    rey: { es: 'El Rey tiene el poder absoluto.', en: 'The King has absolute power.' },
    caps: { es: '¿Cuántas tapas hay? Adivina o toma.', en: 'How many caps? Guess or drink.' },
    retos: { es: 'Retos aleatorios para animar la mesa.', en: 'Random challenges to liven up the table.' },
  }

  return (
    <section id="juegos" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="font-heading text-6xl sm:text-8xl text-gold neon-gold mb-3">
            {lang === 'es' ? 'Juegos de Bar' : 'Bar Games'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {lang === 'es' ? 'Para que la noche no se quede en silencio.' : "So the night doesn't stay quiet."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-heading text-lg tracking-wider rounded border transition-all min-h-[44px] ${
                active === tab.id
                  ? 'bg-gold text-black border-gold'
                  : 'border-border hover:border-gold hover:text-gold'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Game area */}
        <div className="border border-border rounded-lg p-6 sm:p-8 bg-card min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-sm mb-4 text-center">
            {descriptions[active][lang === 'es' ? 'es' : 'en']}
          </p>
          {active === 'bottle' && <PicoBottle />}
          {active === 'nunca' && <NuncaNunca />}
          {active === 'verdad' && <VerdadOTrago />}
          {active === 'rey' && <ReyDeLaMesa />}
          {active === 'caps' && <JuegoDeTapas />}
          {active === 'retos' && <RetosGrupales />}
        </div>
      </div>
    </section>
  )
}
