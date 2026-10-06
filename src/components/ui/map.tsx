import * as React from "react";
import { Minus, Plus, LocateFixed, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A slippy map with no mapping library: raster tiles, pointer panning, wheel
 * zoom and DOM markers. Enough for "where is this clinic", not a replacement
 * for Leaflet or MapLibre when you need vector styles, routing or clustering.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapMarker extends LatLng {
  key: string;
  /** Replace the default pin. */
  icon?: React.ReactNode;
  color?: string;
  title?: React.ReactNode;
  /** Card shown when the marker is clicked. */
  popup?: React.ReactNode;
}

export interface MapTileLayer {
  url: string;
  attribution: React.ReactNode;
  maxZoom?: number;
  subdomains?: string[];
}

export const OSM_TILES: MapTileLayer = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: (
    <>
      ©{" "}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">
        OpenStreetMap
      </a>{" "}
      contributors
    </>
  ),
  maxZoom: 19,
  subdomains: ["a", "b", "c"],
};

export interface MapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  center?: LatLng;
  defaultCenter?: LatLng;
  zoom?: number;
  defaultZoom?: number;
  onChange?: (view: { center: LatLng; zoom: number }) => void;
  markers?: MapMarker[];
  activeMarker?: string | null;
  onMarkerClick?: (marker: MapMarker) => void;
  tiles?: MapTileLayer;
  height?: number | string;
  minZoom?: number;
  maxZoom?: number;
  /** Show +/- and recentre controls. */
  controls?: boolean;
  /** Wheel zoom; turn off inside long scrolling pages. */
  scrollZoom?: boolean;
  /** Grey the tiles, so markers and overlays read first. */
  muted?: boolean;
  className?: string;
}

const TILE = 256;
const BANGKOK: LatLng = { lat: 13.7563, lng: 100.5018 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Web-Mercator: world pixel coordinates at a given zoom. */
function project({ lat, lng }: LatLng, zoom: number) {
  const scale = TILE * Math.pow(2, zoom);
  const sin = Math.sin((clamp(lat, -85.05112878, 85.05112878) * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function unproject(x: number, y: number, zoom: number): LatLng {
  const scale = TILE * Math.pow(2, zoom);
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - 2 * Math.PI * (y / scale);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

export function Map({
  center: centerProp,
  defaultCenter = BANGKOK,
  zoom: zoomProp,
  defaultZoom = 13,
  onChange,
  markers = [],
  activeMarker,
  onMarkerClick,
  tiles = OSM_TILES,
  height = 320,
  minZoom = 2,
  maxZoom,
  controls = true,
  scrollZoom = true,
  muted = false,
  className,
  ...props
}: MapProps) {
  const hardMax = maxZoom ?? tiles.maxZoom ?? 19;
  const [innerCenter, setInnerCenter] = React.useState(defaultCenter);
  const [innerZoom, setInnerZoom] = React.useState(defaultZoom);
  const center = centerProp ?? innerCenter;
  const zoom = zoomProp ?? innerZoom;

  const [openMarker, setOpenMarker] = React.useState<string | null>(null);
  const active = activeMarker !== undefined ? activeMarker : openMarker;

  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 640, height: 320 });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const commit = React.useCallback(
    (next: { center?: LatLng; zoom?: number }) => {
      const view = { center: next.center ?? center, zoom: next.zoom ?? zoom };
      if (centerProp === undefined && next.center) setInnerCenter(next.center);
      if (zoomProp === undefined && next.zoom !== undefined) setInnerZoom(next.zoom);
      onChange?.(view);
    },
    [center, zoom, centerProp, zoomProp, onChange],
  );

  const origin = React.useMemo(() => {
    const c = project(center, zoom);
    return { x: c.x - size.width / 2, y: c.y - size.height / 2 };
  }, [center, zoom, size.width, size.height]);

  /** Visible tiles, plus one ring so panning does not reveal empty space. */
  const tileList = React.useMemo(() => {
    const count = Math.pow(2, zoom);
    const x0 = Math.floor(origin.x / TILE) - 1;
    const y0 = Math.floor(origin.y / TILE) - 1;
    const cols = Math.ceil(size.width / TILE) + 3;
    const rows = Math.ceil(size.height / TILE) + 3;
    const out: { key: string; url: string; left: number; top: number }[] = [];

    for (let dx = 0; dx < cols; dx++) {
      for (let dy = 0; dy < rows; dy++) {
        const tx = x0 + dx;
        const ty = y0 + dy;
        if (ty < 0 || ty >= count) continue;
        const wrapped = ((tx % count) + count) % count;
        const subdomains = tiles.subdomains ?? ["a"];
        const url = tiles.url
          .replace("{s}", subdomains[Math.abs(tx + ty) % subdomains.length])
          .replace("{z}", String(zoom))
          .replace("{x}", String(wrapped))
          .replace("{y}", String(ty));
        out.push({ key: `${zoom}/${tx}/${ty}`, url, left: tx * TILE - origin.x, top: ty * TILE - origin.y });
      }
    }
    return out;
  }, [origin.x, origin.y, size.width, size.height, zoom, tiles]);

  const toScreen = React.useCallback(
    (point: LatLng) => {
      const p = project(point, zoom);
      return { left: p.x - origin.x, top: p.y - origin.y };
    },
    [origin.x, origin.y, zoom],
  );

  // ---------------------------------------------------------------- panning
  const drag = React.useRef<{ x: number; y: number; center: LatLng } | null>(null);
  const [panning, setPanning] = React.useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, center };
    setPanning(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const start = project(state.center, zoom);
    commit({ center: unproject(start.x - (e.clientX - state.x), start.y - (e.clientY - state.y), zoom) });
  };

  const endDrag = () => {
    drag.current = null;
    setPanning(false);
  };

  // ---------------------------------------------------------------- zooming
  const zoomAround = (nextZoom: number, screenX?: number, screenY?: number) => {
    const target = clamp(Math.round(nextZoom * 100) / 100, minZoom, hardMax);
    if (target === zoom) return;
    if (screenX === undefined || screenY === undefined) {
      commit({ zoom: target });
      return;
    }
    // keep the point under the cursor fixed while the scale changes
    const before = unproject(origin.x + screenX, origin.y + screenY, zoom);
    const p = project(before, target);
    commit({ zoom: target, center: unproject(p.x - screenX + size.width / 2, p.y - screenY + size.height / 2, target) });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollZoom) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    zoomAround(zoom + (e.deltaY < 0 ? 1 : -1), e.clientX - rect.left, e.clientY - rect.top);
  };

  const openPopup = (marker: MapMarker) => {
    if (activeMarker === undefined) setOpenMarker((prev) => (prev === marker.key ? null : marker.key));
    onMarkerClick?.(marker);
  };

  const activeData = markers.find((m) => m.key === active);

  return (
    <div
      ref={ref}
      data-slot="map"
      className={cn("relative overflow-hidden rounded-xl border border-border bg-fill-tertiary select-none", className)}
      style={{ height }}
      {...props}
    >
      <div
        role="application"
        aria-label="Map"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={(e) => {
          const step = 60;
          const start = project(center, zoom);
          const move = (dx: number, dy: number) => commit({ center: unproject(start.x + dx, start.y + dy, zoom) });
          if (e.key === "ArrowLeft") move(-step, 0);
          else if (e.key === "ArrowRight") move(step, 0);
          else if (e.key === "ArrowUp") move(0, -step);
          else if (e.key === "ArrowDown") move(0, step);
          else if (e.key === "+" || e.key === "=") zoomAround(zoom + 1);
          else if (e.key === "-") zoomAround(zoom - 1);
          else return;
          e.preventDefault();
        }}
        className={cn("absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40", panning ? "cursor-grabbing" : "cursor-grab")}
      >
        <div className={cn("absolute inset-0", muted && "opacity-70 grayscale")} aria-hidden>
          {tileList.map((t) => (
            <img
              key={t.key}
              src={t.url}
              alt=""
              draggable={false}
              loading="lazy"
              width={TILE}
              height={TILE}
              className="absolute"
              style={{ left: t.left, top: t.top }}
            />
          ))}
        </div>

        {markers.map((marker) => {
          const { left, top } = toScreen(marker);
          if (left < -60 || top < -60 || left > size.width + 60 || top > size.height + 60) return null;
          const isActive = marker.key === active;
          return (
            <button
              key={marker.key}
              type="button"
              data-slot="map-marker"
              data-active={isActive || undefined}
              title={typeof marker.title === "string" ? marker.title : undefined}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openPopup(marker);
              }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full transition-transform duration-mid ease-kk-spring-snap",
                isActive ? "z-20 scale-110" : "z-10 hover:scale-110",
              )}
              style={{ left, top, color: marker.color ?? "var(--kk-primary)" }}
            >
              {marker.icon ?? <MapPin className="size-6 drop-shadow" fill="currentColor" strokeWidth={1.5} />}
            </button>
          );
        })}

        {activeData?.popup && (
          <div
            data-slot="map-popup"
            className="kk-spring-in absolute z-30 w-56 -translate-x-1/2 -translate-y-[calc(100%+28px)] rounded-lg border border-border bg-bg-elevated p-3 text-sm shadow-kk"
            style={toScreen(activeData)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {activeData.popup}
          </div>
        )}
      </div>

      {controls && (
        <div className="absolute top-3 right-3 z-30 flex flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-kk-tertiary">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomAround(zoom + 1)}
            className="kk-press flex size-8 items-center justify-center text-text-secondary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomAround(zoom - 1)}
            className="kk-press flex size-8 items-center justify-center border-t border-border-secondary text-text-secondary transition-colors hover:bg-fill-tertiary hover:text-text"
          >
            <Minus className="size-4" />
          </button>
          {markers.length > 0 && (
            <button
              type="button"
              aria-label="Centre on markers"
              onClick={() => {
                const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
                const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
                commit({ center: { lat, lng } });
              }}
              className="kk-press flex size-8 items-center justify-center border-t border-border-secondary text-text-secondary transition-colors hover:bg-fill-tertiary hover:text-text"
            >
              <LocateFixed className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* tile providers require attribution; keep it visible */}
      <div
        data-slot="map-attribution"
        className="pointer-events-auto absolute right-0 bottom-0 z-30 rounded-tl-md bg-bg-container/85 px-1.5 py-0.5 text-[10px] text-text-tertiary"
      >
        {tiles.attribution}
      </div>
    </div>
  );
}
