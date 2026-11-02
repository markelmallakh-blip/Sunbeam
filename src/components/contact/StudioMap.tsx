"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Map as LeafletMap } from "leaflet";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

/* The studio's position, from Google's pin for the address. */
const STUDIO: [number, number] = [30.0798244, 31.327489];

/*
 * Contact page map: OpenStreetMap's standard tiles (no API key) toned down to soft greys, with
 * our own pin — a black circle holding the white Sunbeam Spaces logo, with a soft glow pulsing out
 * of it. Leaflet loads in the browser only; the pin is rendered into the marker through a
 * portal. Scroll-wheel zoom stays off so the page scrolls past it, and "Open in Maps" sits in
 * the top-left corner.
 */
export function StudioMap({ title, mapsHref }: { title: string; mapsHref: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinHost, setPinHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      const container = containerRef.current;
      if (cancelled || !container) return;
      map = L.map(container, {
        center: STUDIO,
        zoom: 16,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      });
      L.control.zoom({ position: "bottomleft" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const marker = L.marker(STUDIO, {
        icon: L.divIcon({ className: "", html: "", iconSize: [80, 80], iconAnchor: [40, 40] }),
        keyboard: false,
        title,
      }).addTo(map);
      setPinHost(marker.getElement() ?? null);
      // Where the details card covers the right of the map, nudge the pin left of centre.
      if (window.matchMedia("(min-width: 640px)").matches) map.panBy([180, 0], { animate: false });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [title]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="region"
        aria-label={title}
        // OpenStreetMap's colours muted to the site's soft greys.
        className="z-0 h-[22rem] w-full bg-mist sm:h-[32rem] lg:h-[36rem] [&_.leaflet-tile-pane]:brightness-[1.04] [&_.leaflet-tile-pane]:contrast-[0.9] [&_.leaflet-tile-pane]:grayscale"
      />
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 z-[500] inline-flex items-center gap-1.5 rounded-[4px] bg-white px-3 py-2 text-small font-medium tracking-[0.5px] text-ink shadow-[0_4px_16px_rgb(0_0_0/0.12)] transition-colors duration-300 hover:bg-ink hover:text-white"
      >
        Open in Maps
        <Icon name="arrow-right" size={14} />
      </a>
      {pinHost && createPortal(<StudioPin />, pinHost)}
    </div>
  );
}

/* Black circle with the white header logo; two rings glow outwards from it in turn. */
function StudioPin() {
  return (
    <span className="relative grid size-20 place-items-center">
      <span
        aria-hidden
        className="absolute inset-0 animate-[pin-glow_2.4s_ease-out_infinite] rounded-full bg-ink/40"
      />
      <span
        aria-hidden
        className="absolute inset-0 animate-[pin-glow_2.4s_ease-out_1.2s_infinite] rounded-full bg-ink/40"
      />
      <span className="relative grid size-[4.5rem] place-items-center rounded-full bg-ink shadow-[0_0_0_3px_rgb(255_255_255),0_8px_24px_rgb(0_0_0/0.35)]">
        <Logo decorative className="w-12 text-white" />
      </span>
    </span>
  );
}
