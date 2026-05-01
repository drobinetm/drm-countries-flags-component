import { CommonModule } from '@angular/common'
import { AfterViewInit, Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import AOS from 'aos'
import {
  CountriesFlagsComponent,
  type CountryChangeEvent,
} from '@drobinetm/angular-countries-flags'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CountriesFlagsComponent],
  template: `
    <main class="min-h-screen bg-slate-950 text-slate-100">
      <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section class="grid gap-6 xl:grid-cols-2">
          <article
            class="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
          >
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-sky-300">Case 01</p>
                <h2 class="mt-2 text-xl font-bold text-white">List all countries</h2>
              </div>
              <span
                class="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200"
                >Default</span
              >
            </div>
            <p class="mb-5 text-sm leading-6 text-slate-300">
              Baseline scenario without max and without filter, shared across the three demos.
            </p>
            <drm-countries-flags
              [(ngModel)]="selectedAll"
              placeholder="Select a country"
              (valueChange)="onChange($event)"
            ></drm-countries-flags>
          </article>

          <article
            class="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-sky-300">Case 02</p>
                <h2 class="mt-2 text-xl font-bold text-white">List four countries with max=4</h2>
              </div>
              <span
                class="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200"
                >Max</span
              >
            </div>
            <p class="mb-5 text-sm leading-6 text-slate-300">
              Validates the max prop using the same shared reference value across all demos.
            </p>
            <drm-countries-flags
              [(ngModel)]="selectedMax"
              [max]="max"
              placeholder="Select a country"
              (valueChange)="onChange($event)"
            ></drm-countries-flags>
          </article>

          <article
            class="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-sky-300">Case 03</p>
                <h2 class="mt-2 text-xl font-bold text-white">Filter by ISO list</h2>
              </div>
              <span
                class="rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200"
                >Filter</span
              >
            </div>
            <p class="mb-3 text-sm leading-6 text-slate-300">
              Uses the same shared filter array in the three demos.
            </p>
            <code class="mb-5 block rounded-2xl bg-slate-950/80 px-4 py-3 text-xs text-slate-300"
              >['es', 'br', 'ar', 'uy', 'us', 'gb']</code
            >
            <drm-countries-flags
              [(ngModel)]="selectedFilter"
              [filter]="filter"
              placeholder="Select a country"
              (valueChange)="onChange($event)"
            ></drm-countries-flags>
          </article>

          <article
            class="demo-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-sky-300">Case 04</p>
                <h2 class="mt-2 text-xl font-bold text-white">Filter plus max</h2>
              </div>
              <span
                class="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200"
                >Combined</span
              >
            </div>
            <p class="mb-5 text-sm leading-6 text-slate-300">
              Validates the combined use of filter and max with the same values across all
              frameworks.
            </p>
            <drm-countries-flags
              [formControl]="selectedMixed"
              [filter]="filter"
              [max]="max"
              placeholder="Select a country"
              (valueChange)="onChange($event)"
            ></drm-countries-flags>
          </article>
        </section>

        <section
          class="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <h2 class="text-xl font-bold text-white">Manual testing notes</h2>
          <div class="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <ul class="space-y-3 text-sm leading-6 text-slate-300">
              <li>Use Enter or Space on the trigger to open the list.</li>
              <li>Use Escape to close the list.</li>
              <li>Click outside the list to close it.</li>
              <li>Resize below 768px and confirm the layout stacks without horizontal overflow.</li>
            </ul>
            <div>
              <p class="text-sm font-semibold text-slate-200">Captured change events</p>
              <ul *ngIf="events.length; else emptyState" class="mt-3 space-y-2">
                <li
                  *ngFor="let entry of events.slice(0, 6); trackBy: trackByEntry"
                  class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                >
                  <span>{{ entry.name }}</span>
                  <code class="text-cyan-300">{{ entry.code }}</code>
                </li>
              </ul>
              <ng-template #emptyState>
                <p
                  class="mt-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400"
                >
                  No events captured yet.
                </p>
              </ng-template>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class AppComponent implements AfterViewInit {
  selectedAll: string | null = null
  selectedMax: string | null = null
  selectedFilter: string | null = null
  selectedMixed = new FormControl<string | null>(null)
  filter = ['es', 'br', 'ar', 'uy', 'us', 'gb']
  max = 4
  events: Array<{ code: string | null; name: string }> = []

  ngAfterViewInit(): void {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
    })
  }

  onChange(event: CountryChangeEvent): void {
    this.events = [
      { code: event.code, name: event.country?.name ?? 'Unknown country' },
      ...this.events,
    ]
  }

  trackByEntry(_index: number, entry: { code: string | null; name: string }): string {
    return `${entry.code}-${entry.name}`
  }
}
