export function PromoBanner() {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-9">
      <div>
        <p className="mb-2 text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-primary/70">
          Exclusive Offer
        </p>
        <h3 className="font-headline text-3xl font-black leading-tight text-white">
          50% OFF<br/>Your First Order
        </h3>
        <p className="mt-2 text-sm text-on-primary/80">
          Use code <strong>RUSH50</strong> at checkout
        </p>
      </div>
      <div className="text-right">
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80" 
          alt="Delicious food"
          className="h-35 w-35 rounded-[1.25rem] object-cover shadow-xl"
        />
      </div>
    </div>
  )
}
