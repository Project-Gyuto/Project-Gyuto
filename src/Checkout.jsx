import React from 'react'

export default function Checkout({ items, subtotal, onClose }) {
  const handleStripe = async () => {
    alert('Demo: Legg inn Stripe-nøkler i .env for ekte testbetaling.')
  }

  const fmt = (n) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-stone-200 p-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kasse</h2>
          <button className="text-stone-600" onClick={onClose}>Lukk</button>
        </div>

        <div className="mt-6 space-y-4">
          {items.length===0 ? (
            <p className="text-sm text-stone-600">Ingen varer i kurven.</p>
          ) : items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center gap-3">
              {product.image ? <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg border" /> : <div className="w-20 h-20 bg-stone-100 rounded-lg border" />}
              <div className="flex-1">
                <div className="text-sm font-medium">{product.name}</div>
                <div className="text-xs text-stone-600">{product.type} · {product.steel} · {product.length} mm</div>
              </div>
              <div className="text-sm">{qty} × {fmt(product.price)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Delsum</span>
            <span className="font-semibold">{fmt(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-stone-600">Frakt beregnes i kassen. Gratis frakt over 1 500 kr.</p>
        </div>

        <div className="mt-6 grid gap-2">
          <button onClick={handleStripe} className="rounded-2xl bg-stone-900 text-white px-5 py-3 text-sm">Test Stripe Checkout</button>
          <button className="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm">Betal med Vipps (kommer)</button>
        </div>
      </div>
    </div>
  )
}
