import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border pt-9">
      <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-headline text-lg font-black italic text-primary">FoodRush</p>
          <p className="mt-2.5 max-w-60 text-sm leading-relaxed text-on-surface-variant">
            Elevating the delivery experience through curation, craft, and culinary passion.
          </p>
          <div className="mt-3.5 flex gap-3 text-lg opacity-60">
            <span className="cursor-pointer" title="Instagram">📸</span>
            <span className="cursor-pointer" title="Twitter">🐦</span>
            <span className="cursor-pointer" title="Facebook">📘</span>
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="mb-3.5 text-[0.7rem] font-extrabold uppercase tracking-widest text-outline-variant">Company</p>
          <div className="flex flex-col gap-2">
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">About</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Add Restaurant</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Careers</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Blog</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="mb-3.5 text-[0.7rem] font-extrabold uppercase tracking-widest text-outline-variant">Support</p>
          <div className="flex flex-col gap-2">
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Privacy</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Terms</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">Contact</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-on-surface">FAQ</Link>
          </div>
        </div>

        {/* Get the App */}
        <div>
          <p className="mb-3.5 text-[0.7rem] font-extrabold uppercase tracking-widest text-outline-variant">Get the App</p>
          <div className="flex flex-col gap-2">
            <span className="cursor-pointer text-sm text-on-surface-variant hover:text-on-surface">📱 iOS App</span>
            <span className="cursor-pointer text-sm text-on-surface-variant hover:text-on-surface">🤖 Android App</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border py-5">
        <p className="text-xs text-outline-variant">© 2024 FoodRush Culinary Group</p>
      </div>
    </footer>
  )
}
