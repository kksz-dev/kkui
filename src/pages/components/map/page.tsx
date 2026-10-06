import { ComponentDoc } from "@/components/docs/component-doc";
import { tr } from "@/i18n/locale";
import meta from "./metadata";
import Basic from "./demos/basic";
import basicCode from "./demos/basic.tsx?raw";
import ControlledDemo from "./demos/controlled";
import controlledCode from "./demos/controlled.tsx?raw";
import MutedDemo from "./demos/muted";
import mutedCode from "./demos/muted.tsx?raw";

export default function Page() {
  return (
    <ComponentDoc
      meta={meta}
      slug="map"
      defaultDemoSize="full"
      imports={["Map", "OSM_TILES", "type MapMarker", "type LatLng"]}
      whenToUse={tr(
        <>
          <p>ใช้ตอบคำถามว่า "อยู่ตรงไหน" — ที่ตั้งสาขา จุดรับบริการ หรือหมุดหลายจุดบนแผนที่เดียว</p>
          <p className="mt-2 text-text-tertiary">ถ้าต้องการ vector style, routing, clustering หรือ layer ซับซ้อน ควรใช้ Leaflet หรือ MapLibre แทน</p>
        </>,
        <>
          <p>Use to answer "where is this": a branch, a service point, or a handful of pins on one map.</p>
          <p className="mt-2 text-text-tertiary">Reach for Leaflet or MapLibre when you need vector styles, routing, clustering or heavy layer work.</p>
        </>,
      )}
      demos={[
        {
          title: tr("หมุดและป๊อปอัป", "Markers and Popups"),
          description: tr("ลากเพื่อเลื่อน ปุ่มซูม และคลิกหมุดเพื่อดูรายละเอียด", "Drag to pan, zoom with the controls, click a pin for its card."),
          code: basicCode,
          component: <Basic />,
        },
        {
          title: tr("ควบคุมจากภายนอก", "Controlled View"),
          description: tr("ส่ง center/zoom เข้ามาเอง แล้วให้ปุ่มด้านบนสั่งย้ายแผนที่", "Pass center and zoom in, and drive them from outside."),
          code: controlledCode,
          component: <ControlledDemo />,
        },
        {
          title: tr("แผนที่โทนสีอ่อน (Muted)", "Muted Map & Colors"),
          description: tr("ปรับสีแผนที่เป็นโทนเทาด้วย muted เพื่อให้หมุดข้อมูลเด่นชัดขึ้น", "Grey the tiles with muted=true so overlay pins pop out clearly."),
          code: mutedCode,
          component: <MutedDemo />,
        },
      ]}
      api={[
        {
          title: "Map",
          rows: [
            { property: "center / defaultCenter", description: "Map centre coordinates", type: "{ lat: number, lng: number }", default: "Bangkok" },
            { property: "zoom / defaultZoom", description: "Zoom level", type: "number", default: "13" },
            { property: "onChange", description: "View changed by pan, zoom or keyboard", type: "(view: { center: LatLng, zoom: number }) => void", default: "-" },
            { property: "markers", description: "Pins with optional popups", type: "MapMarker[]", default: "[]" },
            { property: "activeMarker / onMarkerClick", description: "Controlled popup", type: "string | null / (marker: MapMarker) => void", default: "-" },
            { property: "tiles", description: "Tile source and attribution", type: "MapTileLayer", default: "OSM_TILES" },
            { property: "scrollZoom", description: "Wheel zoom; turn off inside long pages", type: "boolean", default: "true" },
            { property: "muted", description: "Grey the tiles so overlays read first", type: "boolean", default: "false" },
            { property: "controls", description: "Zoom and recentre buttons", type: "boolean", default: "true" },
            { property: "minZoom / maxZoom", description: "Zoom bounds", type: "number", default: "2 / tile max" },
            { property: "height", description: "Map height", type: "number | string", default: "320" },
          ],
        },
        {
          title: "MapMarker",
          rows: [
            { property: "key", description: "Unique marker identifier", type: "string", default: "-" },
            { property: "lat / lng", description: "Geographic position", type: "number", default: "-" },
            { property: "icon", description: "Replace the pin glyph", type: "ReactNode", default: "<MapPin />" },
            { property: "color", description: "Pin colour, any CSS colour token or hex", type: "string", default: "--kk-primary" },
            { property: "popup", description: "Card shown on click", type: "ReactNode", default: "-" },
          ],
        },
      ]}
      related={[{ path: "/components/chart", title: "Chart" }, { path: "/components/card", title: "Card" }]}
    />
  );
}
