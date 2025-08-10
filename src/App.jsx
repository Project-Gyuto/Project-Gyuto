import React, { useMemo, useState } from 'react'
import DATA from './products.json'
import Checkout from './Checkout.jsx'

const NOK = (n) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n);
const PRODUCTS = DATA
const STEELS = ["VG-10", "SG2/R2", "Aogami Super", "White #2"];
const FINISHES = ["Polert", "Satin", "Nashiji", "Tsuchime", "Damask", "Damask/Tsuchime", "Kurouchi", "Kasumi"];
const TYPES = ["Gyuto", "Santoku", "Nakiri", "Bunka", "Petty", "Kiritsuke", "Yanagiba"];

function KnifeSVG({ className }) {
  return (
    <svg viewBox="0 0 360 100" className={className} aria-hidden>
      <defs><linearGradient id="blade" x1="0" x2="1"><stop offset="0%" stopOpacity="1" /><stop offset="100%" stopOpacity="0.9" /></linearGradient></defs>
      <rect x="0" y="40" width="250" height="20" rx="2" fill="url(#blade)" className="fill-slate-200" />
      <polygon points="250,40 330,50 250,60" className="fill-slate-300" />
      <rect x="330" y="37" width="20" height="26" rx="2" className="fill-slate-700" />
      <rect x="320" y="44" width="10" height="12" className="fill-slate-400" />
    </svg>
  );
}

function Badge({ children }) { return <span className="rounded-full bg-white border border-stone-300 shadow-sm px-3 py-1">{children}</span>; }
function Label({ children }) { return <div className="text-xs uppercase tracking-wide text-stone-600">{children}</div>; }
function Card({ title, children }) { return (<div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">{title && <div className="font-medium mb-3">{title}</div>}{children}</div>); }
function ToggleChip({ active, onClick, children }) { return (<button onClick={onClick} className={`text-sm px-3 py-1 rounded-full border ${active ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-300 hover:bg-stone-50"}`}>{children}</button>); }

export default function App() {
  const [query, setQuery] = useState("");
  const [steel, setSteel] = useState([]);
  const [lengths, setLengths] = useState([120, 300]);
  const [finish, setFinish] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceMax, setPriceMax] = useState(9000);
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.type.toLowerCase().includes(query.toLowerCase())) &&
      (steel.length === 0 || steel.includes(p.steel)) &&
      (types.length === 0 || types.includes(p.type)) &&
      (finish.length === 0 || finish.includes(p.finish)) &&
      p.length >= lengths[0] && p.length <= lengths[1] &&
      p.price <= priceMax
    );
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "length": list.sort((a, b) => a.length - b.length); break;
      default: list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [query, steel, lengths, finish, types, priceMax, sort]);

  const add = (p) => setCart((c) => ({ ...c, [p.id]: { product: p, qty: (c[p.id]?.qty || 0) + 1 } }));
  const dec = (id) => setCart((c) => { const q = (c[id]?.qty || 0) - 1; const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = { ...n[id], qty: q }; return n; });
  const subtotal = Object.values(cart).reduce((s, { product, qty }) => s + product.price * qty, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-stone-100/90 bg-stone-100/80 border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <div className="font-serif text-2xl tracking-tight">Project Gyuto</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {TYPES.map((t) => (<button key={t} className="hover:underline" onClick={() => setTypes((prev) => prev.includes(t) ? prev.filter(x => x!==t) : [...prev, t])}>{t}</button>))}
          </div>
          <div className="ml-auto flex items-center gap-3 w-full md:w-auto">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Søk kniver…" className="w-full md:w-72 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-stone-400"/>
            <button onClick={()=>setCartOpen(true)} className="relative rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-50">
              Handlekurv
              {Object.keys(cart).length>0 && (<span className="ml-2 rounded-full bg-stone-900 text-white text-xs px-2 py-0.5">{Object.values(cart).reduce((n,i)=>n+i.qty,0)}</span>)}
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">Japanske kniver smidd for presisjon, valgt for norske kjøkken</h1>
            <p className="mt-4 text-stone-700">Lette, sylskarpe og laget for å vare. Fra hverdagskokk til proff – finn kniven som gjør kutting til en stille nytelse.</p>
            <div className="mt-6 flex gap-3">
              <a href="#shop" className="rounded-2xl bg-stone-900 text-white px-5 py-3 text-sm">Kjøp nå</a>
              <a href="#filters" className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm">Se kolleksjon</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-stone-600">
              <Badge>80 dagers åpent kjøp</Badge>
              <Badge>Gratis første sliping</Badge>
              <Badge>Rask levering 1–3 dager</Badge>
              <Badge>Gratis frakt over 1500 kr</Badge>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/1] rounded-3xl bg-gradient-to-br from-stone-200 to-stone-50 border border-stone-200 shadow-inner flex items-center justify-center">
              <KnifeSVG className="w-[88%]" />
            </div>
          </div>
        </div>
      </section>

      <main id="shop" className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-[280px,1fr] gap-8">
        <aside id="filters" className="space-y-6">
          <Card title="Filtre">
            <div className="space-y-4">
              <div><Label>Ståltype</Label><div className="mt-2 grid grid-cols-2 gap-2">{STEELS.map(s => (<ToggleChip key={s} active={steel.includes(s)} onClick={()=>setSteel(prev=> prev.includes(s)? prev.filter(x=>x!==s): [...prev, s])}>{s}</ToggleChip>))}</div></div>
              <div><Label>Finish</Label><div className="mt-2 grid grid-cols-2 gap-2">{FINISHES.map(f => (<ToggleChip key={f} active={finish.includes(f)} onClick={()=>setFinish(prev=> prev.includes(f)? prev.filter(x=>x!==f): [...prev, f])}>{f}</ToggleChip>))}</div></div>
              <div><Label>Bladlengde: {lengths[0]}–{lengths[1]} mm</Label><div className="mt-3 grid grid-cols-2 gap-3 items-center"><input type="range" min={120} max={300} value={lengths[0]} onChange={(e)=>setLengths([Number(e.target.value), lengths[1]])} /><input type="range" min={120} max={300} value={lengths[1]} onChange={(e)=>setLengths([lengths[0], Number(e.target.value)])} /></div></div>
              <div><Label>Makspris: {NOK(priceMax)}</Label><input className="mt-2 w-full" type="range" min={800} max={9000} step={50} value={priceMax} onChange={(e)=>setPriceMax(Number(e.target.value))} /></div>
              <div><Label>Type</Label><div className="mt-2 flex flex-wrap gap-2">{TYPES.map(t => (<ToggleChip key={t} active={types.includes(t)} onClick={()=>setTypes(prev=> prev.includes(t)? prev.filter(x=>x!==t): [...prev, t])}>{t}</ToggleChip>))}</div></div>
              <div className="pt-2 flex gap-2"><button className="px-4 py-2 rounded-xl border border-stone-300" onClick={()=>{setSteel([]); setFinish([]); setTypes([]); setLengths([120,300]); setPriceMax(9000); setQuery(""); setSort("featured");}}>Nullstill</button></div>
            </div>
          </Card>
        </aside>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-stone-600">{filtered.length} produkter</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-stone-600">Sorter</label>
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
                <option value="featured">Utvalgt først</option>
                <option value="price-asc">Pris lav–høy</option>
                <option value="price-desc">Pris høy–lav</option>
                <option value="length">Bladlengde</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.id} className="group rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                <div className="aspect-[5/3] bg-stone-100 grid place-items-center overflow-hidden">
                  {p.image ? (<img src={p.image} alt={p.name} className="w-full h-full object-cover" />) : (<KnifeSVG className="w-[88%]" />)}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium leading-snug">{p.name}</h3>
                    {p.featured && <span className="text-[10px] uppercase tracking-wide bg-stone-900 text-white rounded px-2 py-1">Utvalgt</span>}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{p.type} · {p.steel} · {p.finish} · {p.length} mm</p>
                  <div className="mt-3 font-semibold text-lg">{NOK(p.price)}</div>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button onClick={()=>add(p)} className="rounded-xl bg-stone-900 text-white px-4 py-2 text-sm">Legg i kurv</button>
                    <button className="rounded-xl border border-stone-300 px-3 py-2 text-sm" onClick={()=>setCartOpen(true)}>Se kurv</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-stone-600">
          <div><div className="font-serif text-xl text-stone-900">Project Gyuto</div><p className="mt-2">Presisjon fra Echizen – valgt for norske kjøkken.</p></div>
          <div><div className="font-medium text-stone-900">Kundeservice</div><ul className="mt-2 space-y-1"><li>Frakt & retur</li><li>Vedlikeholdsguider</li><li>Garanti</li></ul></div>
          <div><div className="font-medium text-stone-900">Trygghet</div><ul className="mt-2 space-y-1"><li>80 dagers åpent kjøp</li><li>Gratis første sliping</li><li>Rask levering 1–3 dager</li></ul></div>
          <div><div className="font-medium text-stone-900">Nyhetsbrev</div><p className="mt-2">Få tips om sliping, nye lanseringer og kampanjer.</p><div className="mt-3 flex gap-2"><input placeholder="Din e‑post" className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm" /><button className="rounded-xl bg-stone-900 text-white px-4 py-2 text-sm">Meld meg på</button></div></div>
        </div>
        <div className="text-center text-xs text-stone-500 pb-8">© {new Date().getFullYear()} Project Gyuto</div>
      </footer>

      <div className={`fixed inset-0 z-50 ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
        <div className={`absolute inset-0 bg-black/20 transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`} onClick={()=>setCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-stone-200 transition-transform ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-5 flex items-center justify-between border-b"><div className="font-medium">Handlekurv</div><button className="text-stone-600" onClick={()=>setCartOpen(false)}>Lukk</button></div>
          <div className="p-5 space-y-4 max-h-[60vh] overflow-auto">
            {Object.keys(cart).length===0 && (<p className="text-sm text-stone-600">Kurven er tom. Legg til produkter for å fortsette.</p>)}
            {Object.values(cart).map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-20 aspect-[5/3] rounded-lg bg-stone-100 grid place-items-center border"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium leading-tight">{product.name}</div>
                  <div className="text-xs text-stone-600">{product.type} · {product.steel} · {product.length} mm</div>
                  <div className="mt-1 text-sm font-semibold">{NOK(product.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded border" onClick={()=>dec(product.id)}>-</button>
                  <span className="w-6 text-center">{qty}</span>
                  <button className="px-2 py-1 rounded border" onClick={()=>add(product)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 border-t mt-auto">
            <div className="flex items-center justify-between text-sm"><span>Delsum</span><span className="font-semibold">{NOK(subtotal)}</span></div>
            <p className="mt-1 text-xs text-stone-600">Pris inkl. mva. Frakt beregnes i kassen. Gratis frakt over 1 500 kr.</p>
            <button className="mt-4 w-full rounded-2xl bg-stone-900 text-white px-5 py-3 text-sm disabled:opacity-50" disabled={subtotal===0} onClick={()=>{setCartOpen(false); setCheckoutOpen(true);}}>Gå til kassen</button>
          </div>
        </div>
      </div>

      {checkoutOpen && (<Checkout items={Object.values(cart)} subtotal={subtotal} onClose={()=>setCheckoutOpen(false)} />)}
    </div>
  );
}
