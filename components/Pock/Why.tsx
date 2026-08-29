import { TiltCard } from './TiltCard';
import {
  Activity,
  Calculator,
  CalendarDays,
  CandlestickChart,
  GraduationCap,
  Landmark,
  NotebookPen,
  PackageCheck,
  ServerCog,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from './Motion';
import { WHY, type WhyIcon } from './content';

const ICONS: Record<WhyIcon, LucideIcon> = {
  Activity,
  Calculator,
  CalendarDays,
  CandlestickChart,
  GraduationCap,
  Landmark,
  NotebookPen,
  PackageCheck,
  ServerCog,
  Star,
};

export function Why() {
  const { lead, tools } = WHY;

  return (
    <section className="band" id="why">
      <div className="wrap">
        <Reveal>
          <div className="sec-head is-center">
            <span className="tag">why tradefinder</span>
            <h2 className="d2">Why choose TradeFinder</h2>
            <p className="lede">
              The scanners are the reason people arrive. This is what they stay for — the
              working tools around them, included rather than upsold.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="why-grid">
            <div className="why-lead">
              <h3 className="why-lead-title">{lead.title}</h3>
              <p className="why-lead-body">{lead.body}</p>
            </div>

            {/* These describe what the subscription includes; none of them has
                its own page yet, so the cards are not links. */}
            {tools.map((tool) => {
              const Icon = ICONS[tool.icon];
              return (
                <TiltCard key={tool.name} className="why-card">
                  <span className="why-icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <h3 className="why-name">{tool.name}</h3>
                  <p className="why-body">{tool.body}</p>
                </TiltCard>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
