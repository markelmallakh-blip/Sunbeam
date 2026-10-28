"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projectsPage, type Project } from "@/content/projects";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ProjectGridCard, type CardHover } from "./ProjectGridCard";

const SERVICES = ["All", "Interior Design", "FF&E"] as const;
type Service = (typeof SERVICES)[number];

const offers = (project: Project, service: Service) =>
  service === "All" || project.services.includes(service);

const matches = (project: Project, filter: string) =>
  filter === "All" || project.category === filter || project.services.includes(filter);

/*
 * Figma "Projects" (185:1587): filter bar over an even three-column grid, then a loader that brings
 * in more as it scrolls into view. Tabs filter on category or service in the browser. Photos
 * drift a few percent inside their frames on scroll; everything is drawn from the start — nothing
 * waits to enter the viewport — and reduced motion turns the drift off.
 */
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const [service, setService] = useState<Service>("All");
  const [hover, setHover] = useState<CardHover>("frame");
  const [visible, setVisible] = useState(projectsPage.pageSize);
  const gridRef = useRef<HTMLDivElement>(null);

  const filters = projectsPage.filters
    .map((name) => ({
      name,
      count: projects.filter((p) => matches(p, name) && offers(p, service)).length,
    }))
    .filter((tab) => tab.count > 0);

  const list = useMemo(() => {
    return projects.filter((project) => matches(project, filter) && offers(project, service));
  }, [projects, filter, service]);
  const shown = list.slice(0, visible);

  useGsap(
    ({ reduceMotion }) => {
      if (reduceMotion || !gridRef.current) return;
      // Each card frame scrubs a --parallax percentage that its photo layers translate by, so the
      // full photo and the flipping crop on top of it (ProjectGridCard) always stay in register.
      gsap.utils.toArray<HTMLElement>("[data-parallax-frame]").forEach((frame) => {
        gsap.fromTo(
          frame,
          { "--parallax": -4 },
          {
            "--parallax": 4,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    gridRef,
    [filter, service, visible],
  );

  return (
    <>
      <div className="px-edge">
        <div className="flex flex-col gap-4 border-y border-hairline py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <ul
            role="tablist"
            aria-label="Filter projects"
            className="flex flex-wrap gap-x-10 gap-y-2"
          >
            {filters.map((tab) => {
              const active = tab.name === filter;
              return (
                <li key={tab.name} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setFilter(tab.name);
                      setVisible(projectsPage.pageSize);
                    }}
                    className={cn(
                      // -mb-px lays the active rule over the bar's own grey bottom line.
                      "-mb-px flex gap-1.5 border-b pt-6 pb-[1.4375rem] text-body font-medium tracking-[1.5px] uppercase transition-colors duration-300",
                      active
                        ? "border-ink text-ink"
                        : "border-transparent text-slate hover:text-ink",
                    )}
                  >
                    {tab.name}
                    <span
                      className={cn(
                        "text-[0.625rem] font-semibold tracking-[0.5px]",
                        active ? "text-ink" : "text-slate",
                      )}
                    >
                      {String(tab.count).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-8">
            {/* Temporary: compares the two card hovers with the client. Remove once chosen. */}
            <div
              role="group"
              aria-label="Card hover"
              className="hidden gap-1 rounded-[4px] bg-mist p-1 lg:flex"
            >
              {(["frame", "flip", "zoom"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={hover === option}
                  onClick={() => setHover(option)}
                  className={cn(
                    "rounded-[2px] px-3 py-1 text-caption font-medium tracking-[1px] uppercase transition-colors duration-300",
                    hover === option ? "bg-white text-ink" : "text-slate hover:text-ink",
                  )}
                >
                  {option[0]?.toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
            <ServiceMenu
              value={service}
              onChange={(next) => {
                setService(next);
                setVisible(projectsPage.pageSize);
              }}
            />
          </div>
        </div>
      </div>

      {/*
       * Even rows of three on desktop; a last row that isn't full stays centred under the others.
       * Phones and tablets get one and two columns.
       */}
      <div
        ref={gridRef}
        role="tabpanel"
        aria-label={`${filter} projects`}
        className="grid gap-12 px-edge pt-[4.5rem] pb-24 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-12 lg:gap-y-20"
      >
        {shown.map((project) => (
          <div key={project.slug} className="lg:w-[calc((100%-6rem)/3)]">
            <ProjectGridCard project={project} hover={hover} />
          </div>
        ))}
      </div>

      {list.length > visible && (
        <LoadMore
          key={visible}
          onLoad={() => setVisible((count) => count + projectsPage.pageSize)}
        />
      )}
    </>
  );
}

/* How long the loader turns before the next projects appear, so the arrival reads as loading. */
const LOAD_DELAY = 700;

/*
 * Figma "Loader 5" (180:5881): a 30px spinner, an ink arc on a Gray 1 ring, under the grid. When it
 * scrolls into view it loads the next page of projects, so there is no button to press. It is
 * keyed by the visible count, so each page gets a fresh loader that waits to be seen again.
 */
function LoadMore({ onLoad }: { onLoad: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || timer) return;
        timer = setTimeout(onLoad, LOAD_DELAY);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [onLoad]);

  return (
    <div ref={ref} role="status" className="flex justify-center px-edge pb-block">
      <svg viewBox="0 0 30 30" className="size-[1.875rem] animate-spin" aria-hidden>
        <circle cx="15" cy="15" r="9" fill="none" strokeWidth="1.5" className="stroke-mist" />
        <path
          d="M15 6a9 9 0 0 1 9 9"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-ink"
        />
      </svg>
      <span className="sr-only">{projectsPage.loading}</span>
    </div>
  );
}

/*
 * "Service" filter beside the tabs: the current choice with a chevron that opens the shared
 * DropdownMenu, where the selected service carries a black check and the others use the
 * secondary text colour.
 */
function ServiceMenu({ value, onChange }: { value: Service; onChange: (next: Service) => void }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="group flex items-center gap-2 self-start text-small tracking-[0.5px] text-slate outline-none sm:self-auto">
        Service
        <span className="font-medium text-ink">{value}</span>
        <Icon
          name="arrow-down"
          size={16}
          className="text-ink transition-transform duration-300 ease-soft group-data-[state=open]:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as Service)}>
          {SERVICES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
