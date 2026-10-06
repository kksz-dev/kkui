import * as React from "react";
import { Check, Loader2, SquareMinus, SquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControlled } from "@/components/ui/input";
import {
  SelectEmpty,
  SelectPopup,
  SelectSelector,
  SelectTrigger,
  toRawValues,
  type LabeledValue,
  type RawValue,
  type SelectPlacement,
  type SelectSize,
  type SelectStatus,
  type SelectTagRenderProps,
  type SelectVariant,
} from "@/components/ui/select";

/**
 * TreeSelect — KKUI TreeSelect: a Select whose popup is a tree
 * (expand / collapse, checkable with parent-child propagation, search, async load).
 * The tree list is implemented inline; trigger + popup come from select.tsx.
 */

export interface TreeSelectNode {
  title?: React.ReactNode;
  value?: RawValue;
  key?: RawValue;
  children?: TreeSelectNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: React.ReactNode;
  [name: string]: unknown;
}

export interface TreeSelectFieldNames {
  label?: string;
  value?: string;
  children?: string;
}

export type ShowCheckedStrategy = "SHOW_ALL" | "SHOW_PARENT" | "SHOW_CHILD";
export const SHOW_ALL: ShowCheckedStrategy = "SHOW_ALL";
export const SHOW_PARENT: ShowCheckedStrategy = "SHOW_PARENT";
export const SHOW_CHILD: ShowCheckedStrategy = "SHOW_CHILD";

export interface TreeSelectChangeExtra<N extends TreeSelectNode = TreeSelectNode> {
  preValue: LabeledValue[];
  triggerValue?: RawValue;
  triggerNode?: N;
  checked?: boolean;
  selected?: boolean;
}

/* ------------------------------------------------------------------ */
/* tree helpers                                                        */
/* ------------------------------------------------------------------ */

interface Entry<N extends TreeSelectNode> {
  node: N;
  value: RawValue;
  title: React.ReactNode;
  level: number;
  parent?: Entry<N>;
  children: Entry<N>[];
  disabled: boolean;
  disableCheckbox: boolean;
  selectable: boolean;
  isLeaf: boolean;
}

function buildEntries<N extends TreeSelectNode>(data: readonly N[], f: Required<TreeSelectFieldNames>) {
  const roots: Entry<N>[] = [];
  const all: Entry<N>[] = [];
  const map = new Map<RawValue, Entry<N>>();
  const walk = (list: readonly N[], parent: Entry<N> | undefined, level: number): Entry<N>[] =>
    list.map((node) => {
      const kids = node[f.children] as N[] | undefined;
      const value = (node[f.value] ?? node.key) as RawValue;
      const e: Entry<N> = {
        node,
        value,
        title: (node[f.label] as React.ReactNode) ?? String(value),
        level,
        parent,
        children: [],
        disabled: !!node.disabled || !!parent?.disabled,
        disableCheckbox: !!node.disableCheckbox,
        selectable: node.selectable !== false,
        isLeaf: node.isLeaf ?? !(kids && kids.length > 0),
      };
      all.push(e);
      map.set(value, e);
      e.children = kids && kids.length ? walk(kids, e, level + 1) : [];
      return e;
    });
  roots.push(...walk(data, undefined, 0));
  return { roots, all, map };
}

/** Parent ⇄ child check propagation (non-strict). Returns full checked + half-checked sets. */
function conduct<N extends TreeSelectNode>(seed: Iterable<RawValue>, roots: Entry<N>[], map: Map<RawValue, Entry<N>>) {
  const checked = new Set<RawValue>();
  const half = new Set<RawValue>();
  const canCheck = (e: Entry<N>) => !e.disabled && !e.disableCheckbox;
  const markDown = (e: Entry<N>) => {
    checked.add(e.value);
    for (const c of e.children) if (canCheck(c)) markDown(c);
  };
  for (const v of seed) {
    const e = map.get(v);
    if (e) markDown(e);
  }
  const up = (e: Entry<N>): void => {
    for (const c of e.children) up(c);
    if (e.children.length === 0 || checked.has(e.value)) return;
    const kids = e.children.filter(canCheck);
    if (kids.length && kids.every((c) => checked.has(c.value))) checked.add(e.value);
    else if (e.children.some((c) => checked.has(c.value) || half.has(c.value))) half.add(e.value);
  };
  for (const r of roots) up(r);
  return { checked, half };
}

function byStrategy<N extends TreeSelectNode>(checked: Set<RawValue>, all: Entry<N>[], strategy: ShowCheckedStrategy): RawValue[] {
  return all
    .filter((e) => checked.has(e.value))
    .filter((e) => {
      if (strategy === "SHOW_ALL") return true;
      if (strategy === "SHOW_PARENT") return !e.parent || !checked.has(e.parent.value);
      return e.children.length === 0;
    })
    .map((e) => e.value);
}

/* ------------------------------------------------------------------ */
/* small visual pieces                                                 */
/* ------------------------------------------------------------------ */

function TreeCheckbox({ checked, indeterminate, disabled }: { checked: boolean; indeterminate: boolean; disabled: boolean }) {
  return (
    <span
      aria-hidden
      data-slot="tree-select-checkbox"
      className={cn(
        "relative me-2 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-bg-container transition-colors duration-mid",
        checked && !disabled && "border-primary bg-primary text-white",
        !checked && !disabled && "group-hover/row:border-primary",
        disabled && "cursor-not-allowed border-border bg-bg-container-disabled",
      )}
    >
      {checked ? (
        <Check className="size-3" strokeWidth={3} />
      ) : indeterminate ? (
        <span className={cn("size-2 rounded-xs", disabled ? "bg-text-disabled" : "bg-primary")} />
      ) : null}
    </span>
  );
}

function Caret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" width="10" height="10" fill="currentColor" aria-hidden className={className}>
      <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TreeSelect                                                          */
/* ------------------------------------------------------------------ */

export interface TreeSelectProps<T = RawValue, N extends TreeSelectNode = TreeSelectNode>
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange" | "onSelect" | "prefix" | "onBlur" | "onFocus"> {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  treeData?: N[];
  /** Flat `treeData` with `id` / `pId` fields; converted to a nested tree */
  treeDataSimpleMode?: boolean | { id?: string; pId?: string; rootPId?: RawValue | null };
  fieldNames?: TreeSelectFieldNames;
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T, labelList: React.ReactNode[], extra: TreeSelectChangeExtra<N>) => void;
  multiple?: boolean;
  /** Show checkboxes; implies multiple */
  treeCheckable?: boolean;
  /** No parent/child propagation; value becomes { value, label }[] */
  treeCheckStrictly?: boolean;
  showCheckedStrategy?: ShowCheckedStrategy;
  labelInValue?: boolean;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: SelectSize;
  status?: SelectStatus;
  variant?: SelectVariant;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  filterTreeNode?: boolean | ((inputValue: string, treeNode: N) => boolean);
  treeNodeFilterProp?: string;
  /** Which node field is shown in the trigger */
  treeNodeLabelProp?: string;
  treeTitleRender?: (node: N) => React.ReactNode;
  treeDefaultExpandAll?: boolean;
  treeDefaultExpandedKeys?: RawValue[];
  treeExpandedKeys?: RawValue[];
  onTreeExpand?: (expandedKeys: RawValue[]) => void;
  /** Expand on title click / double click; false = only the caret expands */
  treeExpandAction?: "click" | "doubleClick" | false;
  treeLine?: boolean;
  treeIcon?: boolean;
  /** Async: load children of a node without `children` (and not `isLeaf`) */
  loadData?: (node: N) => Promise<unknown>;
  notFoundContent?: React.ReactNode;
  listHeight?: number;
  placement?: SelectPlacement;
  popupMatchSelectWidth?: boolean | number;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
  /** @deprecated use popupStyle */
  dropdownStyle?: React.CSSProperties;
  popupRender?: (menu: React.ReactElement) => React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  switcherIcon?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode);
  maxTagCount?: number | "responsive";
  maxTagPlaceholder?: React.ReactNode | ((omitted: LabeledValue[]) => React.ReactNode);
  maxCount?: number;
  tagRender?: (props: SelectTagRenderProps) => React.ReactNode;
  autoClearSearchValue?: boolean;
  autoFocus?: boolean;
  onSelect?: (value: RawValue, node: N) => void;
  onDeselect?: (value: RawValue, node: N) => void;
  onClear?: () => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
}

let uid = 0;

function TreeSelect<T = RawValue, N extends TreeSelectNode = TreeSelectNode>({
  className,
  style,
  treeData = [],
  treeDataSimpleMode = false,
  fieldNames,
  value,
  defaultValue,
  onChange,
  multiple: multipleProp = false,
  treeCheckable = false,
  treeCheckStrictly = false,
  showCheckedStrategy = "SHOW_CHILD",
  labelInValue: labelInValueProp = false,
  placeholder,
  disabled = false,
  loading = false,
  size = "md",
  status,
  variant = "outlined",
  allowClear = false,
  showSearch: showSearchProp,
  searchValue: searchValueProp,
  onSearch,
  filterTreeNode = true,
  treeNodeFilterProp = "value",
  treeNodeLabelProp,
  treeTitleRender,
  treeDefaultExpandAll = false,
  treeDefaultExpandedKeys,
  treeExpandedKeys,
  onTreeExpand,
  treeExpandAction = false,
  treeLine = false,
  treeIcon = false,
  loadData,
  notFoundContent,
  listHeight = 256,
  placement = "bottomLeft",
  popupMatchSelectWidth = true,
  popupClassName,
  popupStyle,
  dropdownStyle,
  popupRender,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  prefix,
  suffixIcon,
  switcherIcon,
  maxTagCount,
  maxTagPlaceholder,
  maxCount,
  tagRender,
  autoClearSearchValue = true,
  autoFocus,
  onSelect,
  onDeselect,
  onClear,
  onBlur,
  onFocus,
  onPopupScroll,
  getPopupContainer,
  ...rest
}: TreeSelectProps<T, N>) {
  const multiple = multipleProp || treeCheckable;
  const strict = treeCheckable && treeCheckStrictly;
  const labelInValue = labelInValueProp || strict;
  const showSearch = showSearchProp ?? multiple;
  const [id] = React.useState(() => `kk-tree-select-${++uid}`);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const labelCache = React.useRef(new Map<RawValue, React.ReactNode>());
  const popupMouseDown = React.useRef(false);

  const f = React.useMemo<Required<TreeSelectFieldNames>>(() => ({ label: "title", value: "value", children: "children", ...fieldNames }), [fieldNames]);
  const nestedData = React.useMemo(() => {
    if (!treeDataSimpleMode) return treeData;
    const cfg = { id: "id", pId: "pId", rootPId: null as RawValue | null, ...(typeof treeDataSimpleMode === "object" ? treeDataSimpleMode : {}) };
    const byId = new Map<unknown, N>();
    for (const n of treeData) byId.set(n[cfg.id], { ...n, [f.children]: [] as N[] });
    const roots: N[] = [];
    byId.forEach((n) => {
      const parent = byId.get(n[cfg.pId]);
      if (parent && n[cfg.pId] !== cfg.rootPId) (parent[f.children] as N[]).push(n);
      else roots.push(n);
    });
    return roots;
  }, [treeData, treeDataSimpleMode, f]);
  const { roots, all, map } = React.useMemo(() => buildEntries(nestedData, f), [nestedData, f]);

  /* ---- state ---- */
  const [rawValues, setRawValues] = useControlled<RawValue[]>(value === undefined ? undefined : toRawValues(value), toRawValues(defaultValue));
  const [search, setSearchInner] = useControlled(searchValueProp, "");
  const [open, setOpenInner] = useControlled(openProp, defaultOpen);
  const [expanded, setExpandedInner] = useControlled<RawValue[]>(
    treeExpandedKeys,
    treeDefaultExpandedKeys ?? (treeDefaultExpandAll ? all.filter((e) => e.children.length).map((e) => e.value) : []),
  );
  const [loadingKeys, setLoadingKeys] = React.useState<RawValue[]>([]);
  const [active, setActive] = React.useState<RawValue | undefined>(undefined);

  React.useEffect(() => {
    const collect = (v: unknown) => {
      const arr: unknown[] = Array.isArray(v) ? v : [v];
      for (const x of arr) if (x && typeof x === "object") labelCache.current.set((x as LabeledValue).value, (x as LabeledValue).label);
    };
    collect(value);
    collect(defaultValue);
  }, [value, defaultValue]);

  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    setOpenInner(next);
    onOpenChange?.(next);
  };
  const setSearch = (next: string) => {
    setSearchInner(next);
    onSearch?.(next);
  };
  const setExpanded = (next: RawValue[]) => {
    setExpandedInner(next);
    onTreeExpand?.(next);
  };

  /* ---- check state ---- */
  const conducted = React.useMemo(() => {
    if (!treeCheckable || strict) return { checked: new Set(rawValues), half: new Set<RawValue>() };
    return conduct(rawValues, roots, map);
  }, [treeCheckable, strict, rawValues, roots, map]);
  const selectedSet = conducted.checked;

  /* ---- search / visible rows ---- */
  const matched = React.useMemo(() => {
    if (!search) return null;
    const fn =
      typeof filterTreeNode === "function"
        ? filterTreeNode
        : (input: string, node: N) => {
            const raw = node[treeNodeFilterProp];
            return (typeof raw === "string" || typeof raw === "number" ? String(raw) : "").toLowerCase().includes(input.toLowerCase());
          };
    const set = new Set<RawValue>();
    for (const e of all) {
      if (filterTreeNode === false || fn(search, e.node)) set.add(e.value);
    }
    // keep ancestors of matches
    for (const v of [...set]) {
      let p = map.get(v)?.parent;
      while (p) {
        set.add(p.value);
        p = p.parent;
      }
    }
    return set;
  }, [search, filterTreeNode, treeNodeFilterProp, all, map]);

  const rows = React.useMemo(() => {
    const out: Entry<N>[] = [];
    const isOpen = (e: Entry<N>) => (matched ? matched.has(e.value) : expanded.includes(e.value));
    const walk = (list: Entry<N>[]) => {
      for (const e of list) {
        if (matched && !matched.has(e.value)) continue;
        out.push(e);
        if (e.children.length && isOpen(e)) walk(e.children);
      }
    };
    walk(roots);
    return out;
  }, [roots, expanded, matched]);

  React.useEffect(() => {
    if (!open) return;
    const first = rows.find((r) => (search ? true : selectedSet.has(r.value))) ?? rows.find((r) => !r.disabled);
    setActive(first?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search]);

  React.useEffect(() => {
    if (active === undefined) return;
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(String(active))}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  /* ---- emit ---- */
  const labelOf = (v: RawValue): React.ReactNode => {
    const e = map.get(v);
    if (e) return (treeNodeLabelProp ? (e.node[treeNodeLabelProp] as React.ReactNode) : undefined) ?? e.title;
    return labelCache.current.get(v);
  };
  const emit = (next: RawValue[], extra: Omit<TreeSelectChangeExtra<N>, "preValue">) => {
    setRawValues(next);
    if (!onChange) return;
    const labels = next.map((v) => labelOf(v) ?? String(v));
    const preValue = rawValues.map((v) => ({ value: v, label: labelOf(v) ?? String(v) }));
    const wrap = (v: RawValue) => (labelInValue ? { value: v, label: labelOf(v) ?? String(v) } : v);
    if (multiple) onChange(next.map(wrap) as T, labels, { preValue, ...extra });
    else onChange((next[0] === undefined ? undefined : wrap(next[0])) as T, labels, { preValue, ...extra });
  };

  const toggleNode = (e: Entry<N>) => {
    if (e.disabled) return;
    if (treeCheckable) {
      if (e.disableCheckbox) return;
      const isChecked = selectedSet.has(e.value);
      let next: RawValue[];
      if (strict) {
        next = isChecked ? rawValues.filter((v) => v !== e.value) : [...rawValues, e.value];
      } else {
        const full = new Set(conducted.checked);
        if (isChecked) {
          const drop = (x: Entry<N>) => {
            full.delete(x.value);
            x.children.forEach(drop);
          };
          drop(e);
          let p = e.parent;
          while (p) {
            full.delete(p.value);
            p = p.parent;
          }
        } else {
          if (maxCount !== undefined && rawValues.length >= maxCount) return;
          full.add(e.value);
        }
        next = byStrategy(conduct(full, roots, map).checked, all, showCheckedStrategy);
      }
      if (maxCount !== undefined && next.length > maxCount) return;
      labelCache.current.set(e.value, e.title);
      emit(next, { triggerValue: e.value, triggerNode: e.node, checked: !isChecked });
      (isChecked ? onDeselect : onSelect)?.(e.value, e.node);
      if (autoClearSearchValue && search) setSearch("");
      return;
    }
    if (!e.selectable) return;
    labelCache.current.set(e.value, e.title);
    if (multiple) {
      const isSelected = rawValues.includes(e.value);
      if (!isSelected && maxCount !== undefined && rawValues.length >= maxCount) return;
      emit(isSelected ? rawValues.filter((v) => v !== e.value) : [...rawValues, e.value], { triggerValue: e.value, triggerNode: e.node, selected: !isSelected });
      (isSelected ? onDeselect : onSelect)?.(e.value, e.node);
      if (autoClearSearchValue && search) setSearch("");
    } else {
      if (rawValues[0] !== e.value) emit([e.value], { triggerValue: e.value, triggerNode: e.node, selected: true });
      onSelect?.(e.value, e.node);
      setSearch("");
      setOpen(false);
    }
  };

  const toggleExpand = (e: Entry<N>) => {
    if (e.isLeaf) return;
    const isOpen = expanded.includes(e.value);
    if (!isOpen && loadData && e.children.length === 0 && !loadingKeys.includes(e.value)) {
      setLoadingKeys((k) => [...k, e.value]);
      Promise.resolve(loadData(e.node)).finally(() => setLoadingKeys((k) => k.filter((x) => x !== e.value)));
    }
    setExpanded(isOpen ? expanded.filter((v) => v !== e.value) : [...expanded, e.value]);
  };

  const removeValue = (v: RawValue) => {
    const e = map.get(v);
    if (disabled || (e && (e.disabled || e.disableCheckbox))) return;
    if (treeCheckable && !strict) {
      const full = new Set(conducted.checked);
      const drop = (x: Entry<N>) => {
        full.delete(x.value);
        x.children.forEach(drop);
      };
      if (e) {
        drop(e);
        let p = e.parent;
        while (p) {
          full.delete(p.value);
          p = p.parent;
        }
      } else full.delete(v);
      emit(byStrategy(conduct(full, roots, map).checked, all, showCheckedStrategy), { triggerValue: v, triggerNode: e?.node, checked: false });
    } else {
      emit(rawValues.filter((x) => x !== v), { triggerValue: v, triggerNode: e?.node, selected: false, checked: false });
    }
    if (e) onDeselect?.(v, e.node);
  };
  const clearAll = () => {
    emit([], {});
    setSearch("");
    onClear?.();
    inputRef.current?.focus();
  };

  /* ---- keyboard ---- */
  const move = (dir: 1 | -1) => {
    const enabled = rows.filter((r) => !r.disabled);
    if (!enabled.length) return;
    const i = enabled.findIndex((r) => r.value === active);
    const next = enabled[(((i + dir) % enabled.length) + enabled.length) % enabled.length];
    setActive(next.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const cur = active !== undefined ? map.get(active) : undefined;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else move(e.key === "ArrowDown" ? 1 : -1);
        break;
      case "ArrowRight":
        if (open && cur && !cur.isLeaf && !expanded.includes(cur.value)) {
          e.preventDefault();
          toggleExpand(cur);
        }
        break;
      case "ArrowLeft":
        if (open && cur && expanded.includes(cur.value)) {
          e.preventDefault();
          toggleExpand(cur);
        }
        break;
      case "Enter":
        if (!open) setOpen(true);
        else if (cur) {
          e.preventDefault();
          toggleNode(cur);
        }
        break;
      case "Escape":
        if (open) {
          e.stopPropagation();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      case "Backspace":
        if (multiple && !search && rawValues.length) removeValue(rawValues[rawValues.length - 1]);
        break;
      case " ":
        if (!showSearch && !open) {
          e.preventDefault();
          setOpen(true);
        }
        break;
    }
  };

  const handleTriggerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const onInput = e.target === inputRef.current;
    if (!onInput) e.preventDefault();
    inputRef.current?.focus();
    if (e.button !== 0) return;
    if (open && onInput && showSearch) return;
    setOpen(!open);
  };

  /* ---- render tree ---- */
  const renderSwitcher = (e: Entry<N>, isOpen: boolean) => {
    if (loadingKeys.includes(e.value)) return <Loader2 className="size-3.5 animate-spin text-primary" />;
    if (e.isLeaf) {
      return treeLine ? (
        <span className="relative block h-full w-full">
          <span className="absolute inset-y-0 start-1/2 border-s border-border" />
          <span className="absolute start-1/2 top-1/2 w-1/2 border-t border-border" />
        </span>
      ) : null;
    }
    if (switcherIcon) return typeof switcherIcon === "function" ? switcherIcon({ expanded: isOpen }) : switcherIcon;
    if (treeLine) return isOpen ? <SquareMinus className="size-3.5" strokeWidth={1.5} /> : <SquarePlus className="size-3.5" strokeWidth={1.5} />;
    return <Caret className={cn("transition-transform duration-mid", !isOpen && "-rotate-90")} />;
  };

  const tree = (
    <div
      ref={listRef}
      id={`${id}-list`}
      role="tree"
      data-slot="tree-select-tree"
      className="kk-scrollbar overflow-y-auto overscroll-contain"
      style={{ maxHeight: listHeight }}
      onScroll={onPopupScroll}
    >
      {rows.length === 0 ? (
        notFoundContent === undefined ? (
          <SelectEmpty />
        ) : (
          notFoundContent
        )
      ) : (
        rows.map((e) => {
          const isOpen = matched ? true : expanded.includes(e.value);
          const isChecked = selectedSet.has(e.value);
          const isHalf = conducted.half.has(e.value);
          const isSelected = !treeCheckable && rawValues.includes(e.value);
          const isActive = active === e.value;
          const canPick = treeCheckable ? !e.disabled && !e.disableCheckbox : e.selectable && !e.disabled;
          const canExpand = !e.isLeaf;
          const title = treeTitleRender ? treeTitleRender(e.node) : e.title;
          return (
            <div
              key={String(e.value)}
              role="treeitem"
              aria-expanded={canExpand ? isOpen : undefined}
              aria-selected={treeCheckable ? isChecked : isSelected}
              aria-disabled={e.disabled || undefined}
              data-value={String(e.value)}
              data-slot="tree-select-node"
              className={cn("group/row flex items-center pb-1 text-sm text-text", e.disabled && "text-text-disabled")}
              onMouseMove={() => {
                if (!e.disabled && !isActive) setActive(e.value);
              }}
            >
              {/* indent */}
              {Array.from({ length: e.level }).map((_, i) => (
                <span key={i} className={cn("relative block h-6 w-6 shrink-0 self-stretch", treeLine && "before:absolute before:inset-y-0 before:end-3 before:border-e before:border-border before:content-['']")} />
              ))}
              {/* switcher */}
              <span
                data-slot="tree-select-switcher"
                className={cn(
                  "relative flex h-6 w-6 shrink-0 items-center justify-center self-stretch text-text",
                  canExpand && !e.disabled && "cursor-pointer rounded-sm hover:bg-fill-tertiary",
                  treeLine && !e.isLeaf && "bg-bg-elevated",
                )}
                onClick={() => toggleExpand(e)}
              >
                {renderSwitcher(e, isOpen)}
              </span>
              {/* checkbox */}
              {treeCheckable && e.node.checkable !== false && (
                <span className="flex h-6 items-center" onClick={() => toggleNode(e)}>
                  <TreeCheckbox checked={isChecked} indeterminate={isHalf} disabled={e.disabled || e.disableCheckbox} />
                </span>
              )}
              {/* title */}
              <span
                data-slot="tree-select-title"
                className={cn(
                  "flex h-6 min-w-0 flex-1 items-center gap-1 rounded-sm px-1 transition-colors duration-mid",
                  canPick ? "cursor-pointer" : "cursor-default",
                  isActive && !e.disabled && "bg-fill-tertiary",
                  isSelected && "bg-control-item-bg-active",
                  e.disabled && "cursor-not-allowed",
                )}
                onClick={() => {
                  if (treeExpandAction === "click" && canExpand) toggleExpand(e);
                  toggleNode(e);
                }}
                onDoubleClick={() => {
                  if (treeExpandAction === "doubleClick" && canExpand) toggleExpand(e);
                }}
              >
                {treeIcon && e.node.icon != null && <span className="flex shrink-0 items-center [&_svg]:size-3.5">{e.node.icon}</span>}
                <span className="truncate">{title}</span>
              </span>
            </div>
          );
        })
      )}
    </div>
  );

  const hasValue = rawValues.length > 0;
  const trigger = (
    <SelectTrigger
      ref={rootRef}
      size={size}
      variant={variant}
      status={status}
      disabled={disabled}
      open={open}
      multiple={multiple}
      prefix={prefix}
      suffixIcon={suffixIcon}
      loading={loading}
      searchable={showSearch}
      showClear={!!allowClear && !disabled && (hasValue || !!search)}
      clearIcon={typeof allowClear === "object" ? allowClear.clearIcon : undefined}
      onClear={clearAll}
      className={cn("inline-flex", className)}
      style={style}
      data-slot="tree-select"
      {...rest}
      onMouseDown={(e) => {
        // spread first, then merge: a caller's own onMouseDown used to replace this
        // one outright and the popup would never open
        rest.onMouseDown?.(e);
        handleTriggerMouseDown(e);
      }}
    >
      <SelectSelector
        multiple={multiple}
        items={rawValues.map((v) => ({ value: v, label: labelOf(v) ?? String(v), disabled: disabled || !!map.get(v)?.disabled }))}
        size={size}
        open={open}
        showSearch={showSearch}
        search={search}
        placeholder={placeholder}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={maxTagPlaceholder}
        tagRender={tagRender}
        onRemove={removeValue}
        inputRef={inputRef}
        inputProps={{
          id,
          "aria-controls": `${id}-list`,
          autoFocus,
          disabled,
          onChange: (e) => {
            if (!showSearch) return;
            setSearch(e.target.value);
            if (!open) setOpen(true);
          },
          onKeyDown: handleKeyDown,
          onFocus,
          onBlur: (e) => {
            if (popupMouseDown.current) return;
            if (search && searchValueProp === undefined) setSearch("");
            setOpen(false);
            onBlur?.(e);
          },
        }}
      />
    </SelectTrigger>
  );

  return (
    <SelectPopup
      getPopupContainer={getPopupContainer}
      open={open && !disabled}
      onOpenChange={setOpen}
      anchor={trigger}
      anchorRef={rootRef}
      placement={placement}
      popupMatchSelectWidth={popupMatchSelectWidth}
      className={popupClassName}
      style={popupStyle ?? dropdownStyle}
      onOutsideBlur={() => setOpen(false)}
    >
      <div
        onMouseDownCapture={() => {
          popupMouseDown.current = true;
          window.setTimeout(() => {
            popupMouseDown.current = false;
          }, 0);
        }}
      >
        {popupRender ? popupRender(tree) : tree}
      </div>
    </SelectPopup>
  );
}

export { TreeSelect };
