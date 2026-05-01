import { useEffect, useState } from 'react'
import { CountriesFlags } from '@drobinetm/react-countries-flags'
import type { CountryChangeEvent } from '@drobinetm/react-countries-flags'
import AOS from 'aos'

const filter = ['es', 'br', 'ar', 'uy', 'us', 'gb']
const max = 4

export default function App() {
  const [selectedAll, setSelectedAll] = useState<string | null>(null)
  const [selectedMax, setSelectedMax] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [selectedMixed, setSelectedMixed] = useState<string | null>(null)
  const [events, setEvents] = useState<Array<{ code: string | null; name: string }>>([])

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
    })
  }, [])

  function register(event: CountryChangeEvent) {
    setEvents((current) => [
      { code: event.code, name: event.country?.name ?? 'Unknown country' },
      ...current,
    ])
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-2">
          <article
            className="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Case 01</p>
                <h2 className="mt-2 text-xl font-bold text-white">List all countries</h2>
              </div>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Default
              </span>
            </div>
            <p className="mb-5 text-sm leading-6 text-slate-300">
              Baseline scenario without max and without filter, shared across the three demos.
            </p>
            <CountriesFlags
              value={selectedAll}
              onChange={(event) => {
                setSelectedAll(event.code)
                register(event)
              }}
              placeholder="Select a country"
            />
          </article>

          <article
            className="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Case 02</p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  List four countries with max=4
                </h2>
              </div>
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                Max
              </span>
            </div>
            <p className="mb-5 text-sm leading-6 text-slate-300">
              Validates the max prop using the same shared reference value across all demos.
            </p>
            <CountriesFlags
              value={selectedMax}
              onChange={(event) => {
                setSelectedMax(event.code)
                register(event)
              }}
              max={max}
              placeholder="Select a country"
            />
          </article>

          <article
            className="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Case 03</p>
                <h2 className="mt-2 text-xl font-bold text-white">Filter by ISO list</h2>
              </div>
              <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">
                Filter
              </span>
            </div>
            <p className="mb-3 text-sm leading-6 text-slate-300">
              Uses the same shared filter array in the three demos.
            </p>
            <code className="mb-5 block rounded-2xl bg-slate-950/80 px-4 py-3 text-xs text-slate-300">
              ['es', 'br', 'ar', 'uy', 'us', 'gb']
            </code>
            <CountriesFlags
              value={selectedFilter}
              onChange={(event) => {
                setSelectedFilter(event.code)
                register(event)
              }}
              filter={filter}
              placeholder="Select a country"
            />
          </article>

          <article
            className="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Case 04</p>
                <h2 className="mt-2 text-xl font-bold text-white">Filter plus max</h2>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Combined
              </span>
            </div>
            <p className="mb-5 text-sm leading-6 text-slate-300">
              Validates the combined use of filter and max with the same values across all
              frameworks.
            </p>
            <CountriesFlags
              value={selectedMixed}
              onChange={(event) => {
                setSelectedMixed(event.code)
                register(event)
              }}
              filter={filter}
              max={max}
              placeholder="Select a country"
            />
          </article>
        </section>

        <section
          className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <h2 className="text-xl font-bold text-white">Manual testing notes</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="space-y-3 text-sm leading-6 text-slate-300">
              <li>Use Enter or Space on the trigger to open the list.</li>
              <li>Use Escape to close the list.</li>
              <li>Click outside the list to close it.</li>
              <li>Resize below 768px and confirm the layout stacks without horizontal overflow.</li>
            </ul>
            <div>
              <p className="text-sm font-semibold text-slate-200">Captured change events</p>
              {events.length ? (
                <ul className="mt-3 space-y-2">
                  {events.slice(0, 6).map((entry) => (
                    <li
                      key={`${entry.code}-${entry.name}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                    >
                      <span>{entry.name}</span>
                      <code className="text-cyan-300">{entry.code}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
                  No events captured yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
