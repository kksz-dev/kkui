import * as React from "react";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControlled } from "@/components/ui/input";
import {
  SelectEmpty,
  SelectPopup,
  SelectSelector,
  SelectTrigger,
  type LabeledValue,
  type RawValue,
  type SelectPlacement,
  type SelectSize,
  type SelectStatus,
  type SelectTagRenderProps,
  type SelectVariant,
} from "@/components/ui/select";

/**
 * Cascader — KKUI Cascader: side-by-side columns for hierarchical choices.
 * Single (value = path) and multiple (checkboxes + propagation), hover expand,
 * changeOnSelect, flattened-path search, lazy loadData, and an inline CascaderPanel.
 */

export interface CascaderOption {
  value?: RawValue;
  label?: React.ReactNode;
  children?: CascaderOption[];
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  [name: string]: unknown;
}

export interface CascaderFieldNames {
  label?: string;
  value?: string;
  children?: string;
}

export type CascaderExpandTrigger = "click" | "hover";
export type CascaderCheckedStrategy = "SHOW_PARENT" | "SHOW_CHILD";

export interface CascaderShowSearchConfig<O extends CascaderOption = CascaderOption> {
  filter?: (inputValue: string, path: O[]) => boolean;
  render?: (inputValue: string, path: O[]) => React.ReactNode;
  sort?: (a: O[], b: O[], inputValue: string) => number;
  limit?: number | false;
  matchInputWidth?: boolean;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

type Field = Required<CascaderFieldNames>;

const optValue = <O extends CascaderOption>(o: O, f: Field) => o[f.value] as RawValue;
const optLabel = <O extends CascaderOption>(o: O, f: Field) => (o[f.label] as React.ReactNode) ?? String(optValue(o, f));
const optChildren = <O extends CascaderOption>(o: O, f: Field) => o[f.children] as O[] | undefined;

const pathKey = (path: RawValue[]) => path.join("__KK__");

function findPath<O extends CascaderOption>(options: readonly O[], path: readonly RawValue[], f: Field): O[] {
  const out: O[] = [];
  let level: readonly O[] | undefined = options;
  for (const v of path) {
    const hit: O | undefined = level?.find((o) => String(optValue(o, f)) === String(v));
    if (!hit) break;
    out.push(hit);
    level = optChildren(hit, f);
  }
  return out;
}

/** All leaf paths (or all paths when changeOnSelect) under the given options. */
function collectPaths<O extends CascaderOption>(options: readonly O[], f: Field, includeNonLeaf: boolean): O[][] {
  const out: O[][] = [];
  const walk = (list: readonly O[], prefix: O[]) => {
    for (const o of list) {
      const next = [...prefix, o];
      const kids = optChildren(o, f);
      if (kids && kids.length) {
        if (includeNonLeaf) out.push(next);
        walk(kids, next);
      } else {
        out.push(next);
      }
    }
  };
  walk(options, []);
  return out;
}

/** Multiple mode: checked/half sets over path keys with parent-child propagation. */
function conductPaths<O extends CascaderOption>(seed: readonly RawValue[][], options: readonly O[], f: Field) {
  const checked = new Set<string>();
  const half = new Set<string>();
  const markDown = (o: O, prefix: RawValue[]) => {
    if (o.disabled) return;
    const p = [...prefix, optValue(o, f)];
    checked.add(pathKey(p));
    for (const c of optChildren(o, f) ?? []) markDown(c, p);
  };
  for (const path of seed) {
    const chain = findPath(options, path, f);
    if (chain.length !== path.length) {
      checked.add(pathKey(path)); // unknown path (e.g. not yet loaded) — keep as-is
      continue;
    }
    markDown(chain[chain.length - 1], chain.slice(0, -1).map((o) => optValue(o, f)));
  }
  const up = (list: readonly O[], prefix: RawValue[]): void => {
    for (const o of list) {
      const p = [...prefix, optValue(o, f)];
      const kids = optChildren(o, f);
      if (kids && kids.length) {
        up(kids, p);
        const key = pathKey(p);
        if (checked.has(key)) continue;
        const enabled = kids.filter((c) => !c.disabled);
        const keys = enabled.map((c) => pathKey([...p, optValue(c, f)]));
        if (keys.length && keys.every((k) => checked.has(k))) checked.add(key);
        else if (kids.some((c) => checked.has(pathKey([...p, optValue(c, f)])) || half.has(pathKey([...p, optValue(c, f)])))) half.add(key);
      }
    }
  };
  up(options, []);
  return { checked, half };
}

function byStrategy<O extends CascaderOption>(checked: Set<string>, options: readonly O[], f: Field, strategy: CascaderCheckedStrategy): RawValue[][] {
  const out: RawValue[][] = [];
  const walk = (list: readonly O[], prefix: RawValue[], parentChecked: boolean) => {
    for (const o of list) {
      const p = [...prefix, optValue(o, f)];
      const isChecked = checked.has(pathKey(p));
      const kids = optChildren(o, f);
      if (isChecked) {
        if (strategy === "SHOW_PARENT") {
          if (!parentChecked) out.push(p);
        } else if (!kids || kids.length === 0) {
          out.push(p);
        }
      }
      if (kids && kids.length) walk(kids, p, isChecked);
    }
  };
  walk(options, [], false);
  return out;
}

function highlight(label: React.ReactNode, input: string): React.ReactNode {
  if (typeof label !== "string" || !input) return label;
  const i = label.toLowerCase().indexOf(input.toLowerCase());
  if (i < 0) return label;
  return (
    <>
      {label.slice(0, i)}
      <span className="text-error">{label.slice(i, i + input.length)}</span>
      {label.slice(i + input.length)}
    </>
  );
}

function CascaderCheckbox({ checked, indeterminate, disabled }: { checked: boolean; indeterminate: boolean; disabled: boolean }) {
  return (
    <span
      aria-hidden
      data-slot="cascader-checkbox"
      className={cn(
        "me-2 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-bg-container transition-colors duration-mid",
        checked && !disabled && "border-primary bg-primary text-white",
        disabled && "cursor-not-allowed border-border bg-bg-container-disabled",
      )}
    >
      {checked ? <Check className="size-3" strokeWidth={3} /> : indeterminate ? <span className={cn("size-2 rounded-xs", disabled ? "bg-text-disabled" : "bg-primary")} /> : null}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* CascaderColumns — the side-by-side panels (shared by popup & panel) */
/* ------------------------------------------------------------------ */

interface CascaderColumnsProps<O extends CascaderOption> {
  options: readonly O[];
  fieldNames: Field;
  activePath: RawValue[];
  onActivePath: (path: RawValue[], option: O) => void;
  onPick: (path: RawValue[], option: O) => void;
  multiple: boolean;
  checked: Set<string>;
  half: Set<string>;
  selectedPath: RawValue[];
  expandTrigger: CascaderExpandTrigger;
  expandIcon?: React.ReactNode;
  optionRender?: (option: O) => React.ReactNode;
  loadingKeys: readonly string[];
  notFoundContent?: React.ReactNode;
}

function CascaderColumns<O extends CascaderOption>({
  options,
  fieldNames: f,
  activePath,
  onActivePath,
  onPick,
  multiple,
  checked,
  half,
  selectedPath,
  expandTrigger,
  expandIcon,
  optionRender,
  loadingKeys,
  notFoundContent,
}: CascaderColumnsProps<O>) {
  if (options.length === 0) {
    return <div className="min-w-[111px]">{notFoundContent === undefined ? <SelectEmpty /> : notFoundContent}</div>;
  }
  const columns: { list: readonly O[]; prefix: RawValue[] }[] = [{ list: options, prefix: [] }];
  let level: readonly O[] | undefined = options;
  const prefix: RawValue[] = [];
  for (const v of activePath) {
    const hit: O | undefined = level?.find((o) => optValue(o, f) === v);
    if (!hit) break;
    prefix.push(v);
    const kids: O[] | undefined = optChildren(hit, f);
    if (kids && kids.length) {
      columns.push({ list: kids, prefix: [...prefix] });
      level = kids;
    } else {
      break;
    }
  }
  return (
    <div data-slot="cascader-columns" className="flex items-start">
      {columns.map((col, ci) => (
        <ul
          key={ci}
          role="menu"
          className={cn("kk-scrollbar m-0 max-h-[180px] min-w-[111px] list-none overflow-auto p-0", ci > 0 && "border-s border-border-secondary")}
        >
          {col.list.map((o) => {
            const v = optValue(o, f);
            const path = [...col.prefix, v];
            const key = pathKey(path);
            const kids = optChildren(o, f);
            const hasKids = (kids && kids.length > 0) || (o.isLeaf === false && !kids);
            const isActive = activePath[ci] === v;
            const isChecked = multiple ? checked.has(key) : selectedPath[ci] === v && selectedPath.length === path.length;
            const isLoading = loadingKeys.includes(key) || !!o.loading;
            return (
              <li
                key={String(v)}
                role="menuitemcheckbox"
                aria-checked={isChecked}
                aria-disabled={o.disabled || undefined}
                data-slot="cascader-option"
                title={typeof optLabel(o, f) === "string" ? (optLabel(o, f) as string) : undefined}
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-sm px-3 py-[5px] text-sm text-text transition-colors duration-mid",
                  isActive && !o.disabled && "bg-fill-tertiary",
                  isChecked && !multiple && "bg-control-item-bg-active font-semibold",
                  o.disabled && "cursor-not-allowed text-text-disabled",
                )}
                onMouseEnter={() => {
                  if (expandTrigger === "hover" && !o.disabled && hasKids) onActivePath(path, o);
                }}
                onClick={() => {
                  if (o.disabled) return;
                  onActivePath(path, o);
                  onPick(path, o);
                }}
              >
                {multiple && (
                  <CascaderCheckbox checked={checked.has(key)} indeterminate={half.has(key)} disabled={!!o.disabled} />
                )}
                <span className="min-w-0 flex-1 truncate">{optionRender ? optionRender(o) : optLabel(o, f)}</span>
                {isLoading ? (
                  <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
                ) : hasKids ? (
                  <span className="flex shrink-0 items-center text-text-tertiary [&_svg]:size-3.5">{expandIcon ?? <ChevronRight />}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cascader                                                            */
/* ------------------------------------------------------------------ */

interface CascaderSingleValueProps<O extends CascaderOption> {
  multiple?: false;
  /** The selected path, e.g. ["zhejiang", "hangzhou"] */
  value?: RawValue[];
  defaultValue?: RawValue[];
  onChange?: (value: RawValue[], selectedOptions: O[]) => void;
}

interface CascaderMultipleValueProps<O extends CascaderOption> {
  multiple: true;
  /** The selected paths */
  value?: RawValue[][];
  defaultValue?: RawValue[][];
  onChange?: (value: RawValue[][], selectedOptions: O[][]) => void;
}

export type CascaderValueProps<O extends CascaderOption> = CascaderSingleValueProps<O> | CascaderMultipleValueProps<O>;

export interface CascaderBaseProps<O extends CascaderOption = CascaderOption>
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange" | "prefix" | "onBlur" | "onFocus"> {
  /** Mount the popup inside another element instead of <body>. */
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement;
  options?: O[];
  fieldNames?: CascaderFieldNames;
  showCheckedStrategy?: CascaderCheckedStrategy;
  /** Select on each level change (single mode) */
  changeOnSelect?: boolean;
  expandTrigger?: CascaderExpandTrigger;
  expandIcon?: React.ReactNode;
  showSearch?: boolean | CascaderShowSearchConfig<O>;
  searchValue?: string;
  onSearch?: (value: string) => void;
  /** Render the selected path in the trigger */
  displayRender?: (labels: string[], selectedOptions?: O[]) => React.ReactNode;
  optionRender?: (option: O) => React.ReactNode;
  loadData?: (selectedOptions: O[]) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  size?: SelectSize;
  status?: SelectStatus;
  variant?: SelectVariant;
  placement?: SelectPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  popupMatchSelectWidth?: boolean | number;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
  /** @deprecated use popupStyle */
  dropdownStyle?: React.CSSProperties;
  popupRender?: (menu: React.ReactElement) => React.ReactNode;
  /** @deprecated use popupRender */
  dropdownRender?: (menu: React.ReactElement) => React.ReactNode;
  notFoundContent?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  maxTagCount?: number | "responsive";
  maxTagPlaceholder?: React.ReactNode | ((omitted: LabeledValue[]) => React.ReactNode);
  tagRender?: (props: SelectTagRenderProps) => React.ReactNode;
  autoClearSearchValue?: boolean;
  autoFocus?: boolean;
  onClear?: () => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Custom trigger: render children instead of the Select-style box */
  children?: React.ReactElement;
}

export type CascaderProps<O extends CascaderOption = CascaderOption> = CascaderBaseProps<O> & CascaderValueProps<O>;

const defaultDisplayRender = (labels: string[]) => labels.join(" / ");
const SEARCH_LIMIT = 50;

let uid = 0;

function Cascader<O extends CascaderOption = CascaderOption>({
  className,
  style,
  options = [],
  fieldNames,
  value,
  defaultValue,
  onChange,
  multiple = false,
  showCheckedStrategy = "SHOW_CHILD",
  changeOnSelect = false,
  expandTrigger = "click",
  expandIcon,
  showSearch = false,
  searchValue: searchValueProp,
  onSearch,
  displayRender = defaultDisplayRender,
  optionRender,
  loadData,
  placeholder,
  disabled = false,
  loading = false,
  allowClear = false,
  size = "md",
  status,
  variant = "outlined",
  placement = "bottomLeft",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  popupMatchSelectWidth = false,
  popupClassName,
  popupStyle,
  dropdownStyle,
  popupRender,
  dropdownRender,
  notFoundContent,
  prefix,
  suffixIcon,
  removeIcon,
  maxTagCount,
  maxTagPlaceholder,
  tagRender,
  autoClearSearchValue = true,
  autoFocus,
  onClear,
  onBlur,
  onFocus,
  children,
  getPopupContainer,
  ...rest
}: CascaderProps<O>) {
  const [id] = React.useState(() => `kk-cascader-${++uid}`);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popupMouseDown = React.useRef(false);
  const f = React.useMemo<Field>(() => ({ label: "label", value: "value", children: "children", ...fieldNames }), [fieldNames]);
  const searchable = showSearch !== false && !children;
  const searchConfig = typeof showSearch === "object" ? showSearch : undefined;

  /* ---- state ---- */
  const normalize = (v: RawValue[] | RawValue[][] | undefined): RawValue[][] => {
    if (!v || v.length === 0) return [];
    return (Array.isArray(v[0]) ? v : [v]) as RawValue[][];
  };
  const [paths, setPaths] = useControlled<RawValue[][]>(value === undefined ? undefined : normalize(value), normalize(defaultValue));
  const [search, setSearchInner] = useControlled(searchValueProp, "");
  const [open, setOpenInner] = useControlled(openProp, defaultOpen);
  const [activePath, setActivePath] = React.useState<RawValue[]>([]);
  const [loadingKeys, setLoadingKeys] = React.useState<string[]>([]);

  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    setOpenInner(next);
    onOpenChange?.(next);
    if (next && !multiple) setActivePath(paths[0] ?? []);
  };
  const setSearch = (next: string) => {
    setSearchInner(next);
    onSearch?.(next);
  };

  /* ---- multiple check state ---- */
  const conducted = React.useMemo(() => {
    if (!multiple) return { checked: new Set<string>(), half: new Set<string>() };
    return conductPaths(paths, options, f);
  }, [multiple, paths, options, f]);

  /* ---- emit ---- */
  const emit = (next: RawValue[][]) => {
    setPaths(next);
    if (!onChange) return;
    const fire = onChange as (value: RawValue[] | RawValue[][], selectedOptions: O[] | O[][]) => void;
    if (multiple) fire(next, next.map((p) => findPath(options, p, f)));
    else fire(next[0] ?? [], findPath(options, next[0] ?? [], f));
  };

  const pick = (path: RawValue[], option: O) => {
    const kids = optChildren(option, f);
    const isLeaf = !(kids && kids.length) && option.isLeaf !== false;
    if (multiple) {
      if (!isLeaf && !kids?.length && option.isLeaf === false) return; // lazy branch: expand only
      const key = pathKey(path);
      const full = new Set(conducted.checked);
      if (full.has(key)) {
        // uncheck: drop the subtree + ancestors
        const dropDown = (o: O, p: RawValue[]) => {
          full.delete(pathKey(p));
          for (const c of optChildren(o, f) ?? []) dropDown(c, [...p, optValue(c, f)]);
        };
        dropDown(option, path);
        for (let i = path.length - 1; i > 0; i--) full.delete(pathKey(path.slice(0, i)));
      } else {
        full.add(key);
      }
      emit(byStrategy(conductPaths([...full].map((k) => k.split("__KK__")), options, f).checked, options, f, showCheckedStrategy));
      if (autoClearSearchValue && search) setSearch("");
      return;
    }
    if (isLeaf) {
      emit([path]);
      setSearch("");
      setOpen(false);
    } else {
      if (changeOnSelect) emit([path]);
      // expand: trigger lazy load
      if (loadData && option.isLeaf === false && !kids?.length) {
        const key = pathKey(path);
        if (!loadingKeys.includes(key)) {
          setLoadingKeys((k) => [...k, key]);
          loadData(findPath(options, path, f));
        }
      }
    }
  };

  // clear per-path loading flag once children arrive
  React.useEffect(() => {
    setLoadingKeys((keys) => {
      // returning a fresh array on every pass would re-trigger this effect for
      // callers that build `options` inline, so keep the identity when nothing left
      const next = keys.filter((k) => {
        const chain = findPath(options, k.split("__KK__"), f);
        const last = chain[chain.length - 1];
        return !(last && optChildren(last, f)?.length);
      });
      return next.length === keys.length ? keys : next;
    });
  }, [options, f]);

  const removePath = (v: RawValue) => {
    // v is the pathKey of a selected path
    emit(paths.filter((p) => pathKey(p) !== String(v)));
  };
  const clearAll = () => {
    emit([]);
    setSearch("");
    onClear?.();
    inputRef.current?.focus();
  };

  /* ---- search results ---- */
  const searchResults = React.useMemo(() => {
    if (!search) return null;
    const filter = searchConfig?.filter ?? ((input: string, path: O[]) => path.some((o) => String(optLabel(o, f) ?? "").toLowerCase().includes(input.toLowerCase())));
    let list = collectPaths(options, f, changeOnSelect && !multiple).filter((p) => filter(search, p));
    if (searchConfig?.sort) list = [...list].sort((a, b) => searchConfig.sort!(a, b, search));
    const limit = searchConfig?.limit === false ? Infinity : (searchConfig?.limit ?? SEARCH_LIMIT);
    return list.slice(0, limit);
  }, [search, options, f, changeOnSelect, multiple, searchConfig]);

  const [activeSearch, setActiveSearch] = React.useState(0);
  React.useEffect(() => setActiveSearch(0), [search]);

  /* ---- display ---- */
  const displayOf = (path: RawValue[]): React.ReactNode => {
    const chain = findPath(options, path, f);
    const labels = (chain.length === path.length ? chain.map((o) => optLabel(o, f)) : path).map((l) => (typeof l === "string" || typeof l === "number" ? String(l) : ""));
    return displayRender(labels, chain.length === path.length ? chain : undefined);
  };

  const shownPaths = multiple ? byStrategy(conducted.checked, options, f, showCheckedStrategy) : paths;
  // keep unknown (not-in-options) paths visible in multiple mode
  const knownKeys = new Set(shownPaths.map(pathKey));
  const extraPaths = multiple ? paths.filter((p) => findPath(options, p, f).length !== p.length && !knownKeys.has(pathKey(p))) : [];
  const displayPaths = multiple ? [...shownPaths, ...extraPaths] : paths;

  /* ---- keyboard ---- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (searchResults) {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
          e.preventDefault();
          setActiveSearch((i) => (((i + (e.key === "ArrowDown" ? 1 : -1)) % searchResults.length) + searchResults.length) % searchResults.length);
          return;
        case "Enter": {
          e.preventDefault();
          const hit = searchResults[activeSearch];
          if (hit) pick(hit.map((o) => optValue(o, f)), hit[hit.length - 1]);
          return;
        }
      }
    }
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
        if (!open) {
          e.preventDefault();
          setOpen(true);
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
        if (multiple && !search && displayPaths.length) removePath(pathKey(displayPaths[displayPaths.length - 1]));
        break;
    }
  };

  const handleTriggerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const onInput = e.target === inputRef.current;
    if (!onInput) e.preventDefault();
    inputRef.current?.focus();
    if (e.button !== 0) return;
    if (open && onInput && searchable) return;
    setOpen(!open);
  };

  /* ---- menu ---- */
  const searchMenu = searchResults && (
    <div role="listbox" className="kk-scrollbar max-h-[256px] overflow-y-auto">
      {searchResults.length === 0 ? (
        notFoundContent === undefined ? (
          <SelectEmpty />
        ) : (
          notFoundContent
        )
      ) : (
        searchResults.map((path, i) => {
          const values = path.map((o) => optValue(o, f));
          const key = pathKey(values);
          const isChecked = multiple ? conducted.checked.has(key) : pathKey(paths[0] ?? []) === key;
          const isDisabled = path.some((o) => o.disabled);
          const label = searchConfig?.render
            ? searchConfig.render(search, path)
            : path.map((o, j) => (
                <React.Fragment key={j}>
                  {j > 0 && " / "}
                  {highlight(optLabel(o, f), search)}
                </React.Fragment>
              ));
          return (
            <div
              key={key}
              role="option"
              aria-selected={isChecked}
              aria-disabled={isDisabled || undefined}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-sm px-3 py-[5px] text-sm text-text transition-colors duration-mid",
                i === activeSearch && !isDisabled && "bg-fill-tertiary",
                isChecked && !multiple && "bg-control-item-bg-active font-semibold",
                isDisabled && "cursor-not-allowed text-text-disabled",
              )}
              onMouseMove={() => setActiveSearch(i)}
              onClick={() => {
                if (!isDisabled) pick(values, path[path.length - 1]);
              }}
            >
              {multiple && <CascaderCheckbox checked={isChecked} indeterminate={conducted.half.has(key)} disabled={isDisabled} />}
              <span className="min-w-0 flex-1 truncate">{label}</span>
            </div>
          );
        })
      )}
    </div>
  );

  const menu = searchMenu ?? (
    <CascaderColumns<O>
      options={options}
      fieldNames={f}
      activePath={activePath}
      onActivePath={(p, o) => {
        setActivePath(p);
        // hover expand also triggers lazy load
        if (loadData && o.isLeaf === false && !optChildren(o, f)?.length) {
          const key = pathKey(p);
          if (!loadingKeys.includes(key)) {
            setLoadingKeys((k) => [...k, key]);
            loadData(findPath(options, p, f));
          }
        }
      }}
      onPick={pick}
      multiple={multiple}
      checked={conducted.checked}
      half={conducted.half}
      selectedPath={paths[0] ?? []}
      expandTrigger={expandTrigger}
      expandIcon={expandIcon}
      optionRender={optionRender}
      loadingKeys={loadingKeys}
      notFoundContent={notFoundContent}
    />
  );
  const render = popupRender ?? dropdownRender;

  const hasValue = displayPaths.length > 0;

  const trigger = children ? (
    <div
      ref={rootRef}
      data-slot="cascader"
      className={cn("inline-flex cursor-pointer", className)}
      style={style}
      onClick={() => {
        if (!disabled) setOpen(!open);
      }}
      {...rest}
    >
      {children}
    </div>
  ) : (
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
      searchable={searchable}
      showClear={!!allowClear && !disabled && (hasValue || !!search)}
      clearIcon={typeof allowClear === "object" ? allowClear.clearIcon : undefined}
      onClear={clearAll}
      className={cn("inline-flex", className)}
      style={style}
      data-slot="cascader"
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
        items={displayPaths.map((p) => ({ value: pathKey(p), label: displayOf(p), disabled }))}
        size={size}
        open={open}
        showSearch={searchable}
        search={search}
        placeholder={placeholder}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={maxTagPlaceholder}
        tagRender={tagRender}
        removeIcon={removeIcon}
        onRemove={removePath}
        inputRef={inputRef}
        inputProps={{
          id,
          autoFocus,
          disabled,
          onChange: (e) => {
            if (!searchable) return;
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
      popupMatchSelectWidth={searchResults && searchConfig?.matchInputWidth !== false ? true : popupMatchSelectWidth}
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
        {render ? render(menu) : menu}
      </div>
    </SelectPopup>
  );
}

/* ------------------------------------------------------------------ */
/* CascaderPanel — inline columns without popup                        */
/* ------------------------------------------------------------------ */

export interface CascaderPanelBaseProps<O extends CascaderOption = CascaderOption> {
  options?: O[];
  fieldNames?: CascaderFieldNames;
  showCheckedStrategy?: CascaderCheckedStrategy;
  changeOnSelect?: boolean;
  expandTrigger?: CascaderExpandTrigger;
  expandIcon?: React.ReactNode;
  optionRender?: (option: O) => React.ReactNode;
  loadData?: (selectedOptions: O[]) => void;
  notFoundContent?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type CascaderPanelProps<O extends CascaderOption = CascaderOption> = CascaderPanelBaseProps<O> & CascaderValueProps<O>;

function CascaderPanel<O extends CascaderOption = CascaderOption>({
  options = [],
  fieldNames,
  value,
  defaultValue,
  onChange,
  multiple = false,
  showCheckedStrategy = "SHOW_CHILD",
  changeOnSelect = false,
  expandTrigger = "click",
  expandIcon,
  optionRender,
  loadData,
  notFoundContent,
  disabled = false,
  className,
  style,
}: CascaderPanelProps<O>) {
  const f = React.useMemo<Field>(() => ({ label: "label", value: "value", children: "children", ...fieldNames }), [fieldNames]);
  const normalize = (v: RawValue[] | RawValue[][] | undefined): RawValue[][] => {
    if (!v || v.length === 0) return [];
    return (Array.isArray(v[0]) ? v : [v]) as RawValue[][];
  };
  const [paths, setPaths] = useControlled<RawValue[][]>(value === undefined ? undefined : normalize(value), normalize(defaultValue));
  const [activePath, setActivePath] = React.useState<RawValue[]>(paths[0] ?? []);
  const [loadingKeys, setLoadingKeys] = React.useState<string[]>([]);

  const conducted = React.useMemo(() => {
    if (!multiple) return { checked: new Set<string>(), half: new Set<string>() };
    return conductPaths(paths, options, f);
  }, [multiple, paths, options, f]);

  const emit = (next: RawValue[][]) => {
    setPaths(next);
    if (!onChange) return;
    const fire = onChange as (value: RawValue[] | RawValue[][], selectedOptions: O[] | O[][]) => void;
    if (multiple) fire(next, next.map((p) => findPath(options, p, f)));
    else fire(next[0] ?? [], findPath(options, next[0] ?? [], f));
  };

  const pick = (path: RawValue[], option: O) => {
    if (disabled) return;
    const kids = optChildren(option, f);
    const isLeaf = !(kids && kids.length) && option.isLeaf !== false;
    if (multiple) {
      const key = pathKey(path);
      const full = new Set(conducted.checked);
      if (full.has(key)) {
        const dropDown = (o: O, p: RawValue[]) => {
          full.delete(pathKey(p));
          for (const c of optChildren(o, f) ?? []) dropDown(c, [...p, optValue(c, f)]);
        };
        dropDown(option, path);
        for (let i = path.length - 1; i > 0; i--) full.delete(pathKey(path.slice(0, i)));
      } else {
        full.add(key);
      }
      emit(byStrategy(conductPaths([...full].map((k) => k.split("__KK__")), options, f).checked, options, f, showCheckedStrategy));
      return;
    }
    if (isLeaf || changeOnSelect) emit([path]);
    if (!isLeaf && loadData && option.isLeaf === false && !kids?.length) {
      const key = pathKey(path);
      if (!loadingKeys.includes(key)) {
        setLoadingKeys((k) => [...k, key]);
        loadData(findPath(options, path, f));
      }
    }
  };

  React.useEffect(() => {
    setLoadingKeys((keys) => {
      // returning a fresh array on every pass would re-trigger this effect for
      // callers that build `options` inline, so keep the identity when nothing left
      const next = keys.filter((k) => {
        const chain = findPath(options, k.split("__KK__"), f);
        const last = chain[chain.length - 1];
        return !(last && optChildren(last, f)?.length);
      });
      return next.length === keys.length ? keys : next;
    });
  }, [options, f]);

  return (
    <div data-slot="cascader-panel" className={cn("inline-block rounded-lg border border-border-secondary bg-bg-container p-1", disabled && "pointer-events-none opacity-50", className)} style={style}>
      <CascaderColumns<O>
        options={options}
        fieldNames={f}
        activePath={activePath}
        onActivePath={(p) => setActivePath(p)}
        onPick={pick}
        multiple={multiple}
        checked={conducted.checked}
        half={conducted.half}
        selectedPath={paths[0] ?? []}
        expandTrigger={expandTrigger}
        expandIcon={expandIcon}
        optionRender={optionRender}
        loadingKeys={loadingKeys}
        notFoundContent={notFoundContent}
      />
    </div>
  );
}

export { Cascader, CascaderPanel };
