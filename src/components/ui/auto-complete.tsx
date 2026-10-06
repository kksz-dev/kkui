import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, useControlled } from "@/components/ui/input";
import {
  SelectMenu,
  SelectPopup,
  defaultFilterOption,
  flattenOptions,
  type FlatOption,
  type SelectOptionType,
  type SelectPlacement,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
} from "@/components/ui/select";

/**
 * AutoComplete — KKUI AutoComplete: a free-text input with a suggestion popup.
 * Uses our Input (or a custom child input via cloneElement) + SelectPopup / SelectMenu.
 */

export interface AutoCompleteOptionType extends SelectOptionType {
  value?: string;
}

export interface AutoCompleteProps<O extends AutoCompleteOptionType = AutoCompleteOptionType> {
  options?: O[];
  value?: string;
  defaultValue?: string;
  /** Called on typing and on selecting an option */
  onChange?: (value: string, option?: O) => void;
  /** Called on typing only */
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: O) => void;
  onClear?: () => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated use onOpenChange */
  onDropdownVisibleChange?: (open: boolean) => void;
  /** false (default) shows every option; true filters by `value`; or a custom predicate */
  filterOption?: boolean | ((inputValue: string, option: O) => boolean);
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  /** Backfill the input with the highlighted option while navigating with the keyboard */
  backfill?: boolean;
  defaultActiveFirstOption?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: SelectSize;
  status?: SelectStatus;
  variant?: SelectVariant;
  notFoundContent?: React.ReactNode;
  optionRender?: (option: O, info: { index: number }) => React.ReactNode;
  popupRender?: (menu: React.ReactElement) => React.ReactNode;
  popupClassName?: string;
  popupStyle?: React.CSSProperties;
  popupMatchSelectWidth?: boolean | number;
  placement?: SelectPlacement;
  listHeight?: number;
  autoFocus?: boolean;
  /** Custom input element (e.g. `<InputTextArea />`); receives value / onChange / onKeyDown / onFocus / onBlur */
  children?: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

interface InjectedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  status?: SelectStatus;
  size?: SelectSize;
  role: string;
  "aria-expanded": boolean;
  "aria-autocomplete": "list";
}

let uid = 0;

function AutoComplete<O extends AutoCompleteOptionType = AutoCompleteOptionType>({
  options = [],
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onSelect,
  onClear,
  onFocus,
  onBlur,
  onOpenChange,
  onDropdownVisibleChange,
  filterOption = false,
  allowClear = false,
  backfill = false,
  defaultActiveFirstOption = true,
  defaultOpen = false,
  open: openProp,
  disabled = false,
  placeholder,
  size = "md",
  status,
  variant = "outlined",
  notFoundContent = null,
  optionRender,
  popupRender,
  popupClassName,
  popupStyle,
  popupMatchSelectWidth = true,
  placement = "bottomLeft",
  listHeight = 256,
  autoFocus,
  children,
  className,
  style,
  id: idProp,
}: AutoCompleteProps<O>) {
  const [autoId] = React.useState(() => `kk-auto-complete-${++uid}`);
  const id = idProp ?? autoId;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [val, setVal] = useControlled(value, defaultValue);
  const [open, setOpenInner] = useControlled(openProp, defaultOpen);
  const [active, setActive] = React.useState(-1);
  const popupMouseDown = React.useRef(false);

  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenInner(next);
    onOpenChange?.(next);
    onDropdownVisibleChange?.(next);
  };

  const items = React.useMemo<FlatOption<O>[]>(() => {
    const flat = flattenOptions(options);
    if (!val || filterOption === false) return flat;
    const fn = typeof filterOption === "function" ? filterOption : (input: string, o: O) => defaultFilterOption(input, o, "value");
    const keep = new Set<string>();
    for (const f of flat) {
      if (f.type === "option" && fn(val, f.option)) {
        keep.add(f.key);
        if (f.groupKey) keep.add(f.groupKey);
      }
    }
    return flat.filter((f) => keep.has(f.key));
  }, [options, val, filterOption]);

  const firstEnabled = React.useCallback(
    (from: number, dir: 1 | -1) => {
      const n = items.length;
      for (let step = 0; step < n; step++) {
        const i = (((from + step * dir) % n) + n) % n;
        const it = items[i];
        if (it.type === "option" && !it.disabled) return i;
      }
      return -1;
    },
    [items],
  );

  const itemsLen = items.length;
  React.useEffect(() => {
    if (open) setActive(defaultActiveFirstOption ? firstEnabled(0, 1) : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, val, itemsLen]);

  const hasMenu = items.length > 0 || notFoundContent != null;
  const visible = open && !disabled && hasMenu;

  const change = (next: string, option?: O) => {
    setVal(next);
    onChange?.(next, option);
  };

  const selectItem = (item: FlatOption<O>) => {
    const next = String(item.value);
    change(next, item.option);
    onSelect?.(next, item.option);
    setOpen(false);
  };

  const injected: InjectedInputProps = {
    value: val,
    onChange: (e) => {
      const text = e.target.value;
      change(text);
      onSearch?.(text);
      if (!open) setOpen(true);
    },
    onKeyDown: (e) => {
      if (disabled) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp": {
          if (!hasMenu) return;
          e.preventDefault();
          if (!open) {
            setOpen(true);
            return;
          }
          const dir = e.key === "ArrowDown" ? 1 : -1;
          const next = firstEnabled(active + dir, dir);
          setActive(next);
          const it = items[next];
          if (backfill && it && it.type === "option") change(String(it.value), it.option);
          break;
        }
        case "Enter": {
          const it = items[active];
          if (open && it && it.type === "option" && !it.disabled) {
            e.preventDefault();
            selectItem(it);
          }
          break;
        }
        case "Escape":
          if (open) {
            e.stopPropagation();
            setOpen(false);
          }
          break;
        case "Tab":
          setOpen(false);
          break;
      }
    },
    onFocus: (e) => {
      if (hasMenu) setOpen(true);
      onFocus?.(e);
    },
    onBlur: (e) => {
      if (popupMouseDown.current) return;
      setOpen(false);
      onBlur?.(e);
    },
    disabled,
    status,
    size,
    role: "combobox",
    "aria-expanded": visible,
    "aria-autocomplete": "list",
  };

  const control = React.isValidElement<Partial<InjectedInputProps>>(children) ? (
    React.cloneElement(children, injected)
  ) : (
    <Input
      {...injected}
      id={id}
      variant={variant}
      placeholder={placeholder}
      autoFocus={autoFocus}
      allowClear={allowClear}
      onClear={onClear}
      aria-controls={`${id}-list`}
      className="w-full"
      onMouseDown={() => {
        if (!open && hasMenu) setOpen(true);
      }}
    />
  );

  const menu = (
    <SelectMenu<O>
      id={`${id}-list`}
      items={items}
      selected={new Set(val ? [val] : [])}
      active={active}
      onActive={setActive}
      onSelect={selectItem}
      listHeight={listHeight}
      notFoundContent={notFoundContent}
      optionRender={optionRender}
    />
  );

  return (
    <SelectPopup
      open={visible}
      onOpenChange={setOpen}
      anchor={
        <div ref={rootRef} data-slot="auto-complete" data-disabled={disabled || undefined} className={cn("inline-flex", className)} style={style}>
          {control}
        </div>
      }
      anchorRef={rootRef}
      placement={placement}
      popupMatchSelectWidth={popupMatchSelectWidth}
      className={popupClassName}
      style={popupStyle}
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
        {popupRender ? popupRender(menu) : menu}
      </div>
    </SelectPopup>
  );
}

export { AutoComplete };
