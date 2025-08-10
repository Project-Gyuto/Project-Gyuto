import React, { useMemo, useState } from 'react'
import DATA from './products.json'

const NOK = (n) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n);
const STEELS = [...new Set(DATA.map(p=>p.steel.split(' ')[0]))]
const TYPES = [...new Set(DATA.map(p=>p.type))]

function Nav({ page, setPage, cartCount }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-stone-100/85 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
        <button className="font-serif text-2xl tracking-tight" onClick={()=>setPage('shop')}>Project Gyuto</button>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <button onClick={()=>setPage('shop')} className={page==='shop'?'underline':''}>Butikk</button>
          <button onClick={()=>setPage('learn')} className={page==='learn'?'underline':''}>Historie</button>
          <button onClick={()=>setPage('steel')} className={page==='steel'?'underline':''}>Stålguide</button>
          <button onClick={()=>setPage('care')} className={page==='care'?'underline':''}>Vedlikehold</button>
        </nav>
        <div className="ml-auto text-sm">🛒 {cartCount}</div>
      </div>
    </header>
  )
}

function ProductCard({ p, add }) {
  return (
    <article className="group rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="aspect-[5/3] bg-stone-100 grid place-items-center overflow-hidden">
        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-xs p-4">Bilde</div>}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-stone-500">{p.brand}</div>
        <h3 className="font-medium leading-snug">{p.name}</h3>
        <p className="mt-1 text-sm text-stone-600">{p.type} · {p.steel} · {p.length} mm</p>
        <div className="mt-3 font-semibold text-lg">{NOK(p.price)}</div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <button onClick={()=>add(p)} className="rounded-xl bg-stone-900 text-white px-4 py-2 text-sm">Legg i kurv</button>
        </div>
      </div>
    </article>
  )
}

function PageLearn() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1>Historien bak japanske kjøkkenkniver</h1>
      <p>Japanske kniver har røtter i sverdsmedtradisjonen. Etter Meiji-perioden ble kunnskapen brukt til kjøkkenkniver i byer som <b>Seki</b>, <b>Sakai</b> og <b>Echizen</b>. Her utviklet man tynnere blader, hardere stål og presis herding.</p>
      <ul>
        <li><b>Gyuto</b> – allround kokkekniv (20–24 cm)</li>
        <li><b>Santoku</b> – kompakt hverdagskniv (16–18 cm)</li>
        <li><b>Nakiri</b> – grønnsakskniv med rett egg</li>
        <li><b>Sujihiki/Yanagiba</b> – lange oppskjæringskniver</li>
      </ul>
    </div>
  )
}
function PageSteel() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1>Stålguide</h1>
      <ul>
        <li><b>VG‑10 / VG‑MAX:</b> 60–61 HRC, rustfritt. God balanse. (Tojiro DP, Shun Classic, Yaxell)</li>
        <li><b>SG2 / R2:</b> 63–65 HRC, pulverstål. Svært lang eggholdning. (Hatsukokoro, Miyabi)</li>
        <li><b>AUS‑8 / MBS‑26:</b> 58–60 HRC, lett å slipe, tilgivende. (Masahiro, Kanetsugu)</li>
      </ul>
    </div>
  )
}
function PageCare() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1>Vedlikehold</h1>
      <ul>
        <li>Skjærebrett i tre – ikke glass/stein.</li>
        <li>Håndvask, tørk straks. Ikke oppvaskmaskin.</li>
        <li>Våtstein 1000/3000, eller gratis første sliping hos oss.</li>
      </ul>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('shop')
  const [query, setQuery] = useState('')
  const [steel, setSteel] = useState([])
  const [types, setTypes] = useState([])
  const [priceMax, setPriceMax] = useState(7000)
  const [cart, setCart] = useState({})

  const list = useMemo(()=>{
    return DATA.filter(p =>
      (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())) &&
      (steel.length===0 || steel.some(s=>p.steel.includes(s))) &&
      (types.length===0 || types.includes(p.type)) &&
      p.price <= priceMax
    )
  }, [query, steel, types, priceMax])

  const add = (p) => setCart(c=> ({...c, [p.id]:{product:p, qty:(c[p.id]?.qty||0)+1}}))
  const cartCount = Object.values(cart).reduce((n,i)=>n+i.qty,0)

  if (page!=='shop') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900">
        <Nav page={page} setPage={setPage} cartCount={cartCount} />
        <main className="mx-auto max-w-5xl px-4 py-10">
          {page==='learn' && <PageLearn/>}
          {page==='steel' && <PageSteel/>}
          {page==='care' && <PageCare/>}
        </main>
      </div>
    )
  }

  const STEEL_SET = [...new Set(DATA.map(p=>p.steel.split(' ')[0]))]
  const TYPE_SET = [...new Set(DATA.map(p=>p.type))]

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Nav page={page} setPage={setPage} cartCount={cartCount} />

      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">Japanske kniver – klare for norske kjøkken</h1>
            <p className="mt-3 text-stone-700">Kuraterte modeller med realistiske priser og tydelig stålguide.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-stone-200 to-stone-50 border border-stone-200 h-40 md:h-56" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[280px,1fr] gap-8">
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">
            <div className="text-xs uppercase tracking-wide text-stone-600">Søk</div>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Søk etter merke eller modell…" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">
            <div className="text-xs uppercase tracking-wide text-stone-600">Stål</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STEEL_SET.map(s => <button key={s} onClick={()=>setSteel(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev, s])} className={`text-sm px-3 py-1 rounded-full border ${steel.includes(s)?'bg-stone-900 text-white border-stone-900':'bg-white border-stone-300'}`}>{s}</button>)}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">
            <div className="text-xs uppercase tracking-wide text-stone-600">Type</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPE_SET.map(t => <button key={t} onClick={()=>setTypes(prev=>prev.includes(t)?prev.filter(x=>x!==t):[...prev, t])} className={`text-sm px-3 py-1 rounded-full border ${types.includes(t)?'bg-stone-900 text-white border-stone-900':'bg-white border-stone-300'}`}>{t}</button>)}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">
            <div className="text-xs uppercase tracking-wide text-stone-600">Makspris</div>
            <input type="range" min={800} max={7000} step={50} value={priceMax} onChange={e=>setPriceMax(Number(e.target.value))} className="mt-3 w-full" />
            <div className="mt-1 text-sm">{NOK(priceMax)}</div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(p => <ProductCard key={p.id} p={p} add={add} />)}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-stone-600 flex flex-wrap gap-6 justify-between">
          <div>© {new Date().getFullYear()} Project Gyuto</div>
          <div className="flex gap-4">
            <button onClick={()=>setPage('learn')} className="underline">Historie</button>
            <button onClick={()=>setPage('steel')} className="underline">Stålguide</button>
            <button onClick={()=>setPage('care')} className="underline">Vedlikehold</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
