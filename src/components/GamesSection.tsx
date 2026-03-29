'use client'

import { useState, useCallback, useRef, memo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { RotateCcw, Shuffle, HelpCircle, Wine, Crown, Trash2, Plus, User, Sparkles } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// PICO BOTELLA - Spin the Bottle with real player targeting
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
  const [animating, setAnimating] = useState(false) // controls CSS transition
  const [spinning, setSpinning] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [history, setHistory] = useState<{ spinner: Player; target: Player }[]>([])
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setCurrentTurn(0)
    setHistory([])
  }

  const spinner = players[currentTurn % players.length]

  const spin = () => {
    if (spinning || players.length < 2) return
    setSpinning(true)
    setSelectedPlayer(null)

    // Pick a random OTHER player (not the spinner)
    const others = players.filter(p => p.id !== spinner.id)
    const target = others[Math.floor(Math.random() * others.length)]
    const targetIdx = players.findIndex(p => p.id === target.id)

    // Calculate target angle — keep it bounded (4-6 full spins max)
    const playerAngleDeg = (targetIdx / players.length) * 360 - 90
    const fullSpins = 1440 + Math.floor(Math.random() * 360)
    const targetAngle = fullSpins + playerAngleDeg + 180

    // Reset angle without animation, then animate to target
    setAnimating(false)
    setAngle(0)
    // Use rAF to ensure the reset paints before we start animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(true)
        setAngle(targetAngle)
      })
    })

    if (spinTimer.current) clearTimeout(spinTimer.current)
    spinTimer.current = setTimeout(() => {
      setSelectedPlayer(target)
      setHistory(h => [...h, { spinner, target }])
      setSpinning(false)
    }, 3200)
  }

  const nextTurn = () => {
    setCurrentTurn(t => t + 1)
    setSelectedPlayer(null)
    // Reset bottle to 0 without animation for clean next spin
    setAnimating(false)
    setAngle(0)
  }

  const resetGame = () => {
    if (spinTimer.current) clearTimeout(spinTimer.current)
    setGameStarted(false)
    setPlayers([])
    setSelectedPlayer(null)
    setAngle(0)
    setAnimating(false)
    setCurrentTurn(0)
    setHistory([])
  }

  const genderColors = { M: '#3B82F6', F: '#EC4899', X: '#8B5CF6' }

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
        <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
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

  const circleRadius = 120
  const playerSize = 42

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Who is spinning */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1">
          {lang === 'es' ? 'Turno de' : 'Turn of'}
        </p>
        <p className="font-heading text-2xl" style={{ color: genderColors[spinner.gender] }}>
          🍾 {spinner.name}
        </p>
      </div>

      {/* Players circle + bottle */}
      <div className="relative" style={{ width: circleRadius * 2 + playerSize + 20, height: circleRadius * 2 + playerSize + 20 }}>
        {/* Player positions around circle */}
        {players.map((p, i) => {
          const playerAngle = (i / players.length) * 360 - 90
          const rad = (playerAngle * Math.PI) / 180
          const centerX = circleRadius + playerSize / 2 + 10
          const centerY = circleRadius + playerSize / 2 + 10
          const x = centerX + Math.cos(rad) * circleRadius - playerSize / 2
          const y = centerY + Math.sin(rad) * circleRadius - playerSize / 2
          const isSelected = selectedPlayer?.id === p.id
          const isSpinner = spinner.id === p.id
          return (
            <div
              key={p.id}
              className="absolute flex flex-col items-center"
              style={{
                left: x,
                top: y,
                width: playerSize,
                transition: 'transform 0.3s, filter 0.3s',
                transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                zIndex: isSelected ? 20 : isSpinner ? 15 : 1,
                filter: isSelected ? 'drop-shadow(0 0 12px rgba(212,160,23,0.6))' : 'none',
              }}
            >
              <div
                className="rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
                style={{
                  width: playerSize,
                  height: playerSize,
                  backgroundColor: genderColors[p.gender],
                  borderColor: isSelected ? '#D4A017' : isSpinner ? '#D4A017' : genderColors[p.gender],
                  boxShadow: isSelected ? '0 0 0 3px rgba(212,160,23,0.4)' : isSpinner ? '0 0 0 2px rgba(212,160,23,0.3)' : 'none',
                }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-[11px] mt-1 max-w-[60px] truncate text-center ${isSelected ? 'text-gold font-bold' : isSpinner ? 'text-gold' : 'text-muted-foreground'}`}>
                {isSpinner && '🍾 '}{p.name}
              </span>
            </div>
          )
        })}

        {/* Center area */}
        <div
          className="absolute rounded-full border-2 border-gold/20 bg-card/80"
          style={{
            width: 70,
            height: 70,
            left: circleRadius + playerSize / 2 + 10 - 35,
            top: circleRadius + playerSize / 2 + 10 - 35,
          }}
        />

        {/* Bottle SVG — GPU-accelerated */}
        <div
          className="absolute"
          style={{
            width: 22,
            height: 90,
            left: circleRadius + playerSize / 2 + 10 - 11,
            top: circleRadius + playerSize / 2 + 10 - 45,
            transform: `rotate(${angle}deg)`,
            transformOrigin: '50% 50%',
            transition: animating ? 'transform 3s cubic-bezier(0.15, 0.6, 0.15, 1)' : 'none',
            willChange: spinning ? 'transform' : 'auto',
          }}
        >
          <svg viewBox="0 0 24 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="9" y="0" width="6" height="20" rx="2" fill="#8B6914" />
            <rect x="8" y="0" width="8" height="6" rx="2" fill="#D4A017" />
            <path d="M9 20 L6 30 L6 85 Q6 95 12 95 Q18 95 18 85 L18 30 L15 20 Z" fill="url(#bottleGrad)" />
            <rect x="7" y="50" width="10" height="20" rx="1" fill="#FFF8E1" opacity="0.3" />
            <defs>
              <linearGradient id="bottleGrad" x1="6" y1="20" x2="18" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A7C32" />
                <stop offset="1" stopColor="#2D5A1B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Result: who with who */}
      {selectedPlayer && (
        <div className="text-center border border-gold/30 rounded-lg p-4 bg-card w-full max-w-xs">
          <p className="text-xs text-muted-foreground mb-2">
            {lang === 'es' ? '¡La botella decidió!' : 'The bottle has decided!'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: genderColors[spinner.gender] }}>
                {spinner.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs mt-1 font-semibold" style={{ color: genderColors[spinner.gender] }}>{spinner.name}</span>
            </div>
            <span className="font-heading text-2xl text-gold">❤️</span>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: genderColors[selectedPlayer.gender] }}>
                {selectedPlayer.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs mt-1 font-semibold" style={{ color: genderColors[selectedPlayer.gender] }}>{selectedPlayer.name}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {selectedPlayer ? (
          <button
            onClick={nextTurn}
            className="px-8 py-3 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[44px]"
          >
            {lang === 'es' ? 'Siguiente turno' : 'Next turn'}
          </button>
        ) : (
          <button
            onClick={spin}
            disabled={spinning}
            className="px-8 py-3 font-heading text-2xl tracking-wider bg-gold text-black rounded hover:bg-orange-bar disabled:opacity-50 transition-all min-h-[44px]"
          >
            {spinning
              ? (lang === 'es' ? 'Girando...' : 'Spinning...')
              : (lang === 'es' ? '¡Girar!' : 'Spin!')
            }
          </button>
        )}
        <button
          onClick={resetGame}
          className="px-4 py-3 border border-border rounded hover:border-red-bar hover:text-red-bar transition-all min-h-[44px]"
          aria-label={lang === 'es' ? 'Reiniciar' : 'Reset'}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-muted-foreground mb-2 text-center">
            {lang === 'es' ? `Ronda ${history.length}` : `Round ${history.length}`}
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {history.slice(-5).map((h, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-secondary/30 text-muted-foreground">
                {h.spinner.name} ❤️ {h.target.name}
              </span>
            ))}
          </div>
        </div>
      )}
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
      {current ? (
        <div className="border border-red-bar/40 rounded-lg p-6 bg-card w-full">
          <p className="font-heading text-2xl text-red-bar leading-tight">{current}</p>
        </div>
      ) : (
        <div className="border border-border/30 rounded-lg p-6 w-full">
          <p className="text-muted-foreground">
            {lang === 'es' ? 'Presiona "Siguiente" para empezar' : 'Press "Next" to start'}
          </p>
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
        {used.length}/{list.length} {lang === 'es' ? 'usadas' : 'used'}
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
  const [used, setUsed] = useState<number[]>([])
  const list = lang === 'es' ? VERDAD_ES : VERDAD_EN

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
      {current ? (
        <div className="border border-orange-bar/40 rounded-lg p-6 bg-card w-full">
          <p className="font-heading text-2xl text-orange-bar leading-tight">{current}</p>
        </div>
      ) : (
        <div className="border border-border/30 rounded-lg p-6 w-full">
          <p className="text-muted-foreground">
            {lang === 'es' ? 'Presiona para sacar una pregunta' : 'Press to draw a question'}
          </p>
        </div>
      )}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground px-3 py-1 border border-border rounded">
          🗣️ {lang === 'es' ? 'Verdad' : 'Truth'}
        </span>
        <span className="text-xs text-muted-foreground">{lang === 'es' ? 'o' : 'or'}</span>
        <span className="text-sm text-muted-foreground px-3 py-1 border border-border rounded">
          🍺 {lang === 'es' ? 'Trago' : 'Drink'}
        </span>
      </div>
      <button
        onClick={next}
        className="px-8 py-3 font-heading text-2xl tracking-wider bg-orange-bar text-white rounded hover:bg-red-bar transition-all min-h-[44px]"
      >
        {lang === 'es' ? 'Sacar pregunta' : 'Draw question'}
      </button>
      <p className="text-xs text-muted-foreground">
        {used.length}/{list.length} {lang === 'es' ? 'usadas' : 'used'}
      </p>
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
  const [used, setUsed] = useState<number[]>([])
  const [hasKing, setHasKing] = useState(false)
  const list = lang === 'es' ? REY_ES : REY_EN

  const crownKing = () => {
    setHasKing(true)
    setCurrent(null)
    setUsed([])
  }

  const drawChallenge = () => {
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

  const abdicate = () => {
    setHasKing(false)
    setCurrent(null)
    setUsed([])
  }

  if (!hasKing) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
          <Crown size={40} className="text-gold" />
        </div>
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
        <Crown size={24} className="text-gold" />
      </div>

      {current ? (
        <div className="border border-gold/40 rounded-lg p-6 bg-card w-full">
          <p className="font-heading text-2xl text-gold leading-tight">{current}</p>
        </div>
      ) : (
        <div className="border border-border/30 rounded-lg p-6 w-full">
          <p className="text-muted-foreground">
            {lang === 'es' ? 'Presiona para sacar una orden' : 'Press to draw an order'}
          </p>
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
          className="px-4 py-3 border border-red-bar/50 text-red-bar rounded hover:bg-red-bar hover:text-white transition-all text-sm min-h-[44px]"
        >
          {lang === 'es' ? 'Abdicar' : 'Abdicate'}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {used.length}/{list.length} {lang === 'es' ? 'órdenes usadas' : 'orders used'}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// JUEGO DE TAPAS - Caps Game (improved visual)
// ═══════════════════════════════════════════════════════════════════
function JuegoDeTapas() {
  const { lang } = useLanguage()
  const [caps, setCaps] = useState<number | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ wins: 0, losses: 0 })

  const newRound = () => {
    setCaps(Math.floor(Math.random() * 10) + 1)
    setGuess('')
    setResult(null)
    setRevealed(false)
  }

  const check = () => {
    if (!caps || !guess) return
    const g = parseInt(guess)
    if (isNaN(g)) return
    setRevealed(true)
    if (g === caps) {
      setResult('correct')
      setScore(s => ({ ...s, wins: s.wins + 1 }))
    } else {
      setResult('wrong')
      setScore(s => ({ ...s, losses: s.losses + 1 }))
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 max-w-sm mx-auto">
      {caps === null ? (
        <>
          <p className="text-sm text-muted-foreground text-center">
            {lang === 'es'
              ? 'Se esconden tapas de botella en la mano. ¿Cuántas hay? Si fallas, ¡tomas!'
              : 'Bottle caps are hidden in the hand. How many? If you miss, drink!'}
          </p>
          <button
            onClick={newRound}
            className="px-8 py-3 font-heading text-2xl tracking-wider bg-red-bar text-white rounded hover:bg-orange-bar transition-all min-h-[44px]"
          >
            {lang === 'es' ? 'Empezar' : 'Start'}
          </button>
        </>
      ) : (
        <>
          {/* Visual caps display */}
          <div className="relative w-32 h-32 rounded-full bg-secondary/40 border-2 border-border flex items-center justify-center">
            {revealed ? (
              <span className="font-heading text-5xl text-gold">{caps}</span>
            ) : (
              <span className="text-4xl">✊</span>
            )}
          </div>

          {!revealed ? (
            <>
              <p className="text-muted-foreground text-sm">
                {lang === 'es' ? '¿Cuántas tapas hay? (1-10)' : 'How many caps? (1-10)'}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && check()}
                  className="w-20 text-center text-2xl font-heading bg-card border border-border rounded p-2 focus:border-gold outline-none text-foreground"
                  placeholder="?"
                />
                <button
                  onClick={check}
                  disabled={!guess}
                  className="px-6 py-2 font-heading text-xl bg-gold text-black rounded hover:bg-orange-bar disabled:opacity-50 transition-all min-h-[44px]"
                >
                  OK
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`text-center font-heading text-2xl px-4 py-2 rounded ${result === 'correct' ? 'text-green-400' : 'text-red-bar'}`}>
                {result === 'correct'
                  ? (lang === 'es' ? `¡Correcto! Eran ${caps}` : `Correct! It was ${caps}`)
                  : (lang === 'es' ? `Eran ${caps}. ¡Toma! 🍺` : `It was ${caps}. Drink! 🍺`)
                }
              </div>
              <button
                onClick={newRound}
                className="px-6 py-2 font-heading text-lg bg-gold text-black rounded hover:bg-orange-bar transition-all min-h-[44px]"
              >
                {lang === 'es' ? 'Otra ronda' : 'Next round'}
              </button>
            </>
          )}

          {/* Score */}
          {(score.wins > 0 || score.losses > 0) && (
            <p className="text-xs text-muted-foreground">
              ✓ {score.wins} — ✗ {score.losses}
            </p>
          )}
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
  const [used, setUsed] = useState<number[]>([])
  const list = lang === 'es' ? RETOS_ES : RETOS_EN

  const draw = () => {
    const available = list.map((_, i) => i).filter(i => !used.includes(i))
    if (available.length === 0) {
      setUsed([])
      const idx = Math.floor(Math.random() * list.length)
      setChallenge(list[idx])
      setUsed([idx])
    } else {
      const idx = available[Math.floor(Math.random() * available.length)]
      setChallenge(list[idx])
      setUsed([...used, idx])
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
      {challenge ? (
        <div className="border border-orange-bar/40 rounded-lg p-6 bg-card w-full">
          <p className="font-heading text-2xl text-orange-bar leading-tight">{challenge}</p>
        </div>
      ) : (
        <div className="border border-border/30 rounded-lg p-6 w-full">
          <p className="text-muted-foreground">
            {lang === 'es' ? 'Presiona para sacar un reto' : 'Press to draw a challenge'}
          </p>
        </div>
      )}
      <button
        onClick={draw}
        className="px-8 py-3 font-heading text-2xl tracking-wider bg-orange-bar text-white rounded hover:bg-red-bar transition-all min-h-[44px]"
      >
        {lang === 'es' ? 'Sacar reto' : 'Draw challenge'}
      </button>
      <p className="text-xs text-muted-foreground">
        {used.length}/{list.length} {lang === 'es' ? 'usados' : 'used'}
      </p>
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

  const tabs: { id: GameTab; label: string; labelShort: string; icon: React.ReactNode }[] = [
    { id: 'bottle', label: lang === 'es' ? 'Pico Botella' : 'Spin the Bottle', labelShort: lang === 'es' ? 'Botella' : 'Bottle', icon: <RotateCcw size={16} /> },
    { id: 'nunca', label: lang === 'es' ? 'Nunca Nunca' : 'Never Have I', labelShort: lang === 'es' ? 'Nunca' : 'Never', icon: <Wine size={16} /> },
    { id: 'verdad', label: lang === 'es' ? 'Verdad o Trago' : 'Truth or Drink', labelShort: lang === 'es' ? 'Verdad' : 'Truth', icon: <Sparkles size={16} /> },
    { id: 'rey', label: lang === 'es' ? 'Rey de la Mesa' : 'King of Table', labelShort: lang === 'es' ? 'Rey' : 'King', icon: <Crown size={16} /> },
    { id: 'caps', label: lang === 'es' ? 'Tapas' : 'Caps', labelShort: lang === 'es' ? 'Tapas' : 'Caps', icon: <HelpCircle size={16} /> },
    { id: 'retos', label: lang === 'es' ? 'Retos' : 'Challenges', labelShort: lang === 'es' ? 'Retos' : 'Retos', icon: <Shuffle size={16} /> },
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-heading text-base sm:text-lg tracking-wider rounded border transition-all min-h-[44px] ${
                active === tab.id
                  ? 'bg-gold text-black border-gold'
                  : 'border-border hover:border-gold hover:text-gold'
              }`}
            >
              {tab.icon}
              <span className="sm:hidden">{tab.labelShort}</span>
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
