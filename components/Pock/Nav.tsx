'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavMenu from '@radix-ui/react-navigation-menu';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { AccountButton } from './Login/AccountButton';
import { AuthCta } from './Login/AuthCta';
import { NAV_SCHEMA, isGroup, type NavGroup, type NavLeaf } from './nav.schema';
import { PURCHASE_HREF } from '@/lib/routes';

export function Nav() {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Hysteresis: a single threshold flips back and forth on the tiniest scroll
    // wobble, which reads as the page shaking.
    const onScroll = () =>
      setScrolled((was) => (was ? window.scrollY > 40 : window.scrollY > 80));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDrawer(false);
      burgerRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  const listRef = useRef<HTMLUListElement>(null);
  const [ink, setInk] = useState<{ x: number; w: number } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [openValue, setOpenValue] = useState('');

  const activeIndex = NAV_SCHEMA.findIndex((entry) =>
    isGroup(entry)
      ? entry.items.some((i) => i.href && pathname.startsWith(i.href))
      : entry.href === pathname,
  );

  const openIndex = openValue ? NAV_SCHEMA.findIndex((e) => e.label === openValue) : -1;

  const target = hovered ?? (openIndex >= 0 ? openIndex : activeIndex);

  const measure = useCallback(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-nav-item]');
    const el = items && target >= 0 ? items[target] : undefined;
    setInk(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [target]);

  useEffect(measure, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  const engage = (e: React.SyntheticEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-item]');
    if (item) setHovered(Number(item.dataset.navItem));
  };

  return (
    <header className={scrolled ? 'nav is-scrolled' : 'nav'}>
      <div className="nav-inner">
        <div className="nav-lead pod">
          <Link href="/" className="brand" aria-label="TradeFinder home">
            <Logo size={30} />
          </Link>

          {/* Not a link: there is no /status page yet, and a status indicator
              that 404s is worse than one that simply reports. */}
          <span className="status-pill" role="status" aria-label="System status: live">
            <span className="status-dot" aria-hidden="true" />
            <span className="status-label" aria-hidden="true">
              System live
            </span>
          </span>
        </div>

        <NavMenu.Root
          className="nav-menu pod"
          delayDuration={80}
          value={openValue}
          onValueChange={setOpenValue}
        >
          <NavMenu.List
            className="nav-list"
            ref={listRef}
            onPointerOver={engage}
            onPointerLeave={() => setHovered(null)}
            onFocus={engage}
            onBlur={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
              setHovered(null);
            }}
          >
            <motion.span
              className="nav-ink"
              aria-hidden="true"
              initial={false}
              animate={ink ? { x: ink.x, width: ink.w, opacity: 1 } : { opacity: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 460, damping: 38, mass: 0.6 }
              }
            />

            {NAV_SCHEMA.map((entry, i) =>
              isGroup(entry) ? (
                <GroupTrigger key={entry.label} group={entry} pathname={pathname} index={i} />
              ) : (
                <NavMenu.Item key={entry.label}>
                  {entry.href ? (
                    <NavMenu.Link asChild active={pathname === entry.href}>
                      <Link href={entry.href} className="nav-link" data-nav-item={i}>
                        {entry.label}
                      </Link>
                    </NavMenu.Link>
                  ) : (
                    <span className="nav-link is-soon" data-nav-item={i}>
                      {entry.label}
                      <SoonPill />
                    </span>
                  )}
                </NavMenu.Item>
              ),
            )}
          </NavMenu.List>

          <div className="nav-viewport-slot">
            <NavMenu.Viewport className="nav-viewport" />
          </div>
        </NavMenu.Root>

        <div className="nav-end pod">
          <ThemeToggle />
          <AccountButton />
          <Link className="btn btn-pear btn-sm" href={PURCHASE_HREF}>
            Buy now
          </Link>
          <button
            ref={burgerRef}
            type="button"
            className="nav-burger"
            aria-expanded={drawer}
            aria-controls="pk-drawer"
            aria-label={drawer ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawer((v) => !v)}
          >
            {drawer ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <motion.div
            id="pk-drawer"
            className="drawer"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 0.75, 0.22, 1] }}
          >
            <div className="drawer-scroll">
              {NAV_SCHEMA.map((entry) =>
                isGroup(entry) ? (
                  <section key={entry.label} className="drawer-group">
                    <h2 className="drawer-heading">{entry.label}</h2>
                    {entry.items.map((item) => (
                      <DrawerLink key={item.label} item={item} pathname={pathname} />
                    ))}
                  </section>
                ) : entry.href ? (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className="drawer-flat"
                    aria-current={pathname === entry.href ? 'page' : undefined}
                  >
                    {entry.label}
                  </Link>
                ) : (
                  <span key={entry.label} className="drawer-flat is-soon">
                    {entry.label}
                    <SoonPill />
                  </span>
                ),
              )}

              <div className="drawer-foot">
                <AuthCta className="btn btn-line" onOpen={() => setDrawer(false)} />
                <Link className="btn btn-pear" href={PURCHASE_HREF}>
                  Buy now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function GroupTrigger({
  group,
  pathname,
  index,
}: {
  group: NavGroup;
  pathname: string;
  index: number;
}) {
  const within = group.items.some((i) => i.href && pathname.startsWith(i.href));

  return (
    <NavMenu.Item value={group.label}>
      <NavMenu.Trigger
        className={within ? 'nav-link is-within' : 'nav-link'}
        data-nav-item={index}
      >
        {group.label}
        <ChevronDown size={14} className="nav-caret" aria-hidden="true" />
      </NavMenu.Trigger>

      <NavMenu.Content className="nav-panel">
        <p className="nav-panel-blurb">{group.blurb}</p>
        <ul className={group.items.length > 2 ? 'nav-panel-grid is-wide' : 'nav-panel-grid'}>
          {group.items.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <NavMenu.Link asChild active={pathname === item.href}>
                  <Link href={item.href} className="nav-card">
                    <NavCardBody item={item} />
                  </Link>
                </NavMenu.Link>
              ) : (
                <span className="nav-card is-soon">
                  <NavCardBody item={item} />
                </span>
              )}
            </li>
          ))}
        </ul>
      </NavMenu.Content>
    </NavMenu.Item>
  );
}

function NavCardBody({ item }: { item: NavLeaf }) {
  return (
    <>
      <span className="nav-card-icon" aria-hidden="true">
        <item.icon size={17} />
      </span>
      <span className="nav-card-text">
        <span className="nav-card-title">
          {item.label}
          {item.live && item.href && <LivePill />}
          {!item.href && <SoonPill />}
        </span>
        <span className="nav-card-desc">{item.desc}</span>
      </span>
    </>
  );
}

function DrawerLink({ item, pathname }: { item: NavLeaf; pathname: string }) {
  const body = (
    <>
      <span className="nav-card-icon" aria-hidden="true">
        <item.icon size={16} />
      </span>
      <span>
        <span className="nav-card-title">
          {item.label}
          {item.live && item.href && <LivePill />}
          {!item.href && <SoonPill />}
        </span>
        <span className="nav-card-desc">{item.desc}</span>
      </span>
    </>
  );

  if (!item.href) return <span className="drawer-item is-soon">{body}</span>;

  return (
    <Link
      href={item.href}
      className="drawer-item"
      aria-current={pathname === item.href ? 'page' : undefined}
    >
      {body}
    </Link>
  );
}

function LivePill() {
  return (
    <span className="live-pill">
      <span className="live-dot" aria-hidden="true" />
      Live
    </span>
  );
}

/* Marks a product surface that is described but not built. Saying "soon" is the
   honest alternative to a link that 404s. */
function SoonPill() {
  return <span className="soon-pill">Soon</span>;
}
