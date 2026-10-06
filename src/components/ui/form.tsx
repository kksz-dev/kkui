import * as React from "react";
import { CircleAlert, CircleCheck, CircleHelp, CircleX, LoaderCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Form — KKUI form with a real field store.
 *
 * `Form.useForm()` returns a live instance (values, errors, touched/validating meta,
 * imperative methods). Fields subscribe to the store, so only the items that care
 * about a change re-render. Nested names (`name={["user", "email"]}`), `Form.List`,
 * `Form.useWatch`, dependencies and `shouldUpdate` all work off the same store.
 */

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

export type FormLayout = "horizontal" | "vertical" | "inline";
export type FormSize = "sm" | "md" | "lg";
export type FormVariant = "outlined" | "filled" | "borderless" | "underlined";
export type FormLabelAlign = "left" | "right";
export type ValidateStatus = "success" | "warning" | "error" | "validating";
export type RuleType = "string" | "number" | "boolean" | "array" | "date" | "email" | "url" | "regexp";

export type StoreValue = unknown;
export type Store = Record<string, StoreValue>;
export type NamePath = string | number | (string | number)[];
/** A name path always in array form (what the store and callbacks hand back). */
export type InternalNamePath = (string | number)[];

export interface ColProps {
  /** Column width out of 24 */
  span?: number;
  /** Left offset out of 24 */
  offset?: number;
}

export type RequiredMark = boolean | "optional" | ((label: React.ReactNode, info: { required: boolean }) => React.ReactNode);

export type FeedbackIcons = (info: {
  status: ValidateStatus;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
}) => Partial<Record<ValidateStatus, React.ReactNode>>;

export type ShouldUpdate =
  | boolean
  | ((prevValues: Store, curValues: Store, info: { source: string }) => boolean);

export interface FormRule {
  /** Value may not be empty (`undefined`, `null`, `""`, `[]`) */
  required?: boolean;
  /** Message shown when this rule fails. Templates support `${label}`, `${min}`, … */
  message?: React.ReactNode;
  /** Value type the rule checks */
  type?: RuleType;
  /** RegExp the (stringified) value must match */
  pattern?: RegExp;
  /** Minimum: the number itself for numbers, otherwise string/array length */
  min?: number;
  /** Maximum: the number itself for numbers, otherwise string/array length */
  max?: number;
  /** Exact number / string length / array length */
  len?: number;
  /** Value must be one of these */
  enum?: StoreValue[];
  /** A whitespace-only string fails */
  whitespace?: boolean;
  /** Transform the value before validating (the store keeps the original) */
  transform?: (value: StoreValue) => StoreValue;
  /** Custom (async) validator — reject / throw to fail */
  validator?: (rule: FormRule, value: StoreValue) => Promise<void> | void;
  /** Failure becomes a warning: it is shown but does not block submit */
  warningOnly?: boolean;
  /** Only run this rule for these triggers */
  validateTrigger?: string | string[];
}

/** Rule that needs the form instance, e.g. to compare with another field. */
export type FormRuleRender = (form: FormInstance) => FormRule;
export type FormRuleItem = FormRule | FormRuleRender;

export interface ValidateMessages {
  default?: string;
  required?: string;
  enum?: string;
  whitespace?: string;
  types?: Partial<Record<RuleType, string>>;
  string?: { len?: string; min?: string; max?: string; range?: string };
  number?: { len?: string; min?: string; max?: string; range?: string };
  array?: { len?: string; min?: string; max?: string; range?: string };
  pattern?: { mismatch?: string };
}

export interface FieldError {
  name: InternalNamePath;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
}

export interface FieldData {
  name: NamePath;
  value?: StoreValue;
  touched?: boolean;
  validating?: boolean;
  errors?: React.ReactNode[];
  warnings?: React.ReactNode[];
}

export interface ValidateErrorEntity<Values = Store> {
  values: Values;
  errorFields: FieldError[];
  outOfDate: boolean;
}

export interface FormInstance<Values = Store> {
  /** Value of one field */
  getFieldValue: (name: NamePath) => StoreValue;
  /** All values, or only the listed ones */
  getFieldsValue: (nameList?: NamePath[] | true) => Values;
  setFieldValue: (name: NamePath, value: StoreValue) => void;
  setFieldsValue: (values: Partial<Values>) => void;
  /** Set value + meta (errors / warnings / touched / validating) of several fields */
  setFields: (fields: FieldData[]) => void;
  /** Back to `initialValues` (Form level first, then the item's `initialValue`) */
  resetFields: (nameList?: NamePath[]) => void;
  /** Resolves with the values, rejects with `{ values, errorFields, outOfDate }` */
  validateFields: (nameList?: NamePath[]) => Promise<Values>;
  /** Validate then fire `onFinish` / `onFinishFailed` */
  submit: () => void;
  getFieldError: (name: NamePath) => React.ReactNode[];
  getFieldWarning: (name: NamePath) => React.ReactNode[];
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
  isFieldTouched: (name: NamePath) => boolean;
  isFieldsTouched: (nameList?: NamePath[] | boolean, allTouched?: boolean) => boolean;
  isFieldValidating: (name: NamePath) => boolean;
  isFieldsValidating: (nameList?: NamePath[]) => boolean;
  /** Scroll the field into view (used by `scrollToFirstError`) */
  scrollToField: (name: NamePath, options?: ScrollIntoViewOptions) => void;
}

/* ------------------------------------------------------------------ */
/* name path helpers                                                   */
/* ------------------------------------------------------------------ */

const EMPTY_PATH: InternalNamePath = [];

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function toPath(name: NamePath): InternalNamePath {
  return Array.isArray(name) ? name : [name];
}

/** Stable map key — keeps `0` and `"0"` apart. */
function keyOf(path: InternalNamePath): string {
  return path.map((seg) => `${typeof seg}:${seg}`).join("|");
}

function samePath(a: InternalNamePath, b: InternalNamePath): boolean {
  return a.length === b.length && a.every((seg, i) => seg === b[i]);
}

function containsPath(list: InternalNamePath[] | undefined, path: InternalNamePath): boolean {
  return !!list && list.some((item) => samePath(item, path));
}

/** `a` is `b` or a parent of `b` */
function isPrefix(a: InternalNamePath, b: InternalNamePath): boolean {
  return a.length <= b.length && a.every((seg, i) => seg === b[i]);
}

function getValue(source: unknown, path: InternalNamePath): StoreValue {
  let current: unknown = source;
  for (const seg of path) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string | number, unknown>)[seg];
  }
  return current;
}

function setValue(source: unknown, path: InternalNamePath, value: StoreValue): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  let clone: Record<string | number, unknown>;
  if (Array.isArray(source)) clone = [...source] as unknown as Record<string | number, unknown>;
  else if (source !== null && typeof source === "object") clone = { ...(source as Record<string, unknown>) };
  else clone = (typeof head === "number" ? [] : {}) as Record<string | number, unknown>;
  clone[head] = setValue(clone[head], rest, value);
  return clone;
}

function deleteValue(source: unknown, path: InternalNamePath): unknown {
  if (path.length === 0 || source === null || typeof source !== "object") return source;
  const [head, ...rest] = path;
  const clone = (Array.isArray(source) ? [...source] : { ...(source as Record<string, unknown>) }) as Record<
    string | number,
    unknown
  >;
  if (rest.length === 0) delete clone[head];
  else clone[head] = deleteValue(clone[head], rest);
  return clone;
}

function isPlainObject(value: unknown): value is Store {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Deep merge for plain objects; anything else (arrays, dayjs, Date…) replaces. */
function mergeStore(target: Store, source: Store): Store {
  const out: Store = { ...target };
  Object.keys(source).forEach((key) => {
    const next = source[key];
    const prev = out[key];
    out[key] = isPlainObject(next) && isPlainObject(prev) ? mergeStore(prev, next) : next;
  });
  return out;
}

function fieldIdOf(path: InternalNamePath, formName?: string): string {
  const tail = path.join("_");
  return formName ? `${formName}_${tail}` : tail;
}

/* ------------------------------------------------------------------ */
/* validation                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_MESSAGES: Required<Omit<ValidateMessages, "types" | "string" | "number" | "array" | "pattern">> &
  Required<Pick<ValidateMessages, "types" | "string" | "number" | "array" | "pattern">> = {
  default: "Validation failed for ${label}",
  required: "Please enter ${label}",
  enum: "${label} must be one of [${enum}]",
  whitespace: "${label} cannot be empty",
  types: {
    string: "${label} is not a valid string",
    number: "${label} is not a valid number",
    boolean: "${label} is not a valid boolean",
    array: "${label} is not a valid array",
    date: "${label} is not a valid date",
    email: "${label} is not a valid email",
    url: "${label} is not a valid url",
    regexp: "${label} is not a valid regexp",
  },
  string: {
    len: "${label} must be exactly ${len} characters",
    min: "${label} must be at least ${min} characters",
    max: "${label} cannot be longer than ${max} characters",
    range: "${label} must be between ${min} and ${max} characters",
  },
  number: {
    len: "${label} must equal ${len}",
    min: "${label} cannot be less than ${min}",
    max: "${label} cannot be greater than ${max}",
    range: "${label} must be between ${min} and ${max}",
  },
  array: {
    len: "${label} must be exactly ${len} items",
    min: "${label} must have at least ${min} items",
    max: "${label} cannot have more than ${max} items",
    range: "${label} must have between ${min} and ${max} items",
  },
  pattern: { mismatch: "${label} does not match ${pattern}" },
};

const EMAIL_RE = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
const URL_RE = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

function isDateLike(value: unknown): boolean {
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  const maybe = value as { isValid?: () => boolean; toDate?: () => Date } | null;
  return !!maybe && typeof maybe.isValid === "function" && typeof maybe.toDate === "function" && maybe.isValid();
}

const TYPE_TEST: Record<RuleType, (value: StoreValue) => boolean> = {
  string: (value) => typeof value === "string",
  number: (value) => typeof value === "number" && !Number.isNaN(value),
  boolean: (value) => typeof value === "boolean",
  array: (value) => Array.isArray(value),
  date: isDateLike,
  email: (value) => typeof value === "string" && EMAIL_RE.test(value),
  url: (value) => typeof value === "string" && URL_RE.test(value),
  regexp: (value) => {
    if (value instanceof RegExp) return true;
    if (typeof value !== "string") return false;
    try {
      return !!new RegExp(value);
    } catch {
      return false;
    }
  },
};

function fillTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\$\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

function isEmptyValue(value: StoreValue): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

/** Run one rule; returns the failure messages (empty = passed). */
async function runRule(
  rule: FormRule,
  rawValue: StoreValue,
  vars: Record<string, unknown>,
  messages: ValidateMessages,
): Promise<React.ReactNode[]> {
  const value = rule.transform ? rule.transform(rawValue) : rawValue;
  const out: React.ReactNode[] = [];
  const fail = (template: string | undefined, extra?: Record<string, unknown>) => {
    if (rule.message !== undefined && rule.message !== null) out.push(rule.message);
    else out.push(fillTemplate(template ?? messages.default ?? DEFAULT_MESSAGES.default, { ...vars, ...extra }));
  };

  if (rule.required && isEmptyValue(value)) {
    fail(messages.required ?? DEFAULT_MESSAGES.required);
    return out;
  }
  if (rule.whitespace && typeof value === "string" && value.length > 0 && value.trim() === "") {
    fail(messages.whitespace ?? DEFAULT_MESSAGES.whitespace);
    return out;
  }

  // Nothing to check on an absent value; an empty string only skips text rules,
  // an empty array still goes through len / min / max.
  const textRule = rule.type === undefined || rule.type === "string" || rule.type === "email" || rule.type === "url" || rule.type === "regexp";
  const skipRest = value === undefined || value === null || (value === "" && textRule);

  if (!skipRest) {
    if (rule.type && !TYPE_TEST[rule.type](value)) {
      fail(messages.types?.[rule.type] ?? DEFAULT_MESSAGES.types[rule.type], { type: rule.type });
      return out;
    }

    if (rule.len !== undefined || rule.min !== undefined || rule.max !== undefined) {
      const kind: "number" | "array" | "string" =
        rule.type === "number" || (rule.type === undefined && typeof value === "number")
          ? "number"
          : rule.type === "array" || (rule.type === undefined && Array.isArray(value))
            ? "array"
            : "string";
      const size =
        kind === "number"
          ? Number(value)
          : kind === "array"
            ? (value as unknown[]).length
            : String(value).length;
      const pack = messages[kind] ?? {};
      const fallback = DEFAULT_MESSAGES[kind];
      const extra = { len: rule.len, min: rule.min, max: rule.max };
      if (rule.len !== undefined && size !== rule.len) {
        fail(pack.len ?? fallback.len, extra);
        return out;
      }
      if (rule.min !== undefined && rule.max !== undefined && (size < rule.min || size > rule.max)) {
        fail(pack.range ?? fallback.range, extra);
        return out;
      }
      if (rule.min !== undefined && size < rule.min) {
        fail(pack.min ?? fallback.min, extra);
        return out;
      }
      if (rule.max !== undefined && size > rule.max) {
        fail(pack.max ?? fallback.max, extra);
        return out;
      }
    }

    if (rule.pattern) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(String(value))) {
        fail(messages.pattern?.mismatch ?? DEFAULT_MESSAGES.pattern.mismatch, { pattern: String(rule.pattern) });
        return out;
      }
    }

    if (rule.enum && !rule.enum.includes(value)) {
      fail(messages.enum ?? DEFAULT_MESSAGES.enum, { enum: rule.enum.join(", ") });
      return out;
    }
  }

  if (rule.validator) {
    try {
      await rule.validator(rule, value);
    } catch (err) {
      const text = err instanceof Error ? err.message : typeof err === "string" ? err : "";
      if (text) out.push(text);
      else fail(messages.default ?? DEFAULT_MESSAGES.default);
    }
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* store                                                               */
/* ------------------------------------------------------------------ */

interface FieldMeta {
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  touched: boolean;
  validating: boolean;
}

const EMPTY_META: FieldMeta = { errors: [], warnings: [], touched: false, validating: false };

interface NotifyInfo {
  type: "valueUpdate" | "reset" | "setField" | "validateFinish" | "dependenciesUpdate";
  relatedFields?: InternalNamePath[];
}

interface FieldConfig {
  label?: React.ReactNode;
  initialValue?: StoreValue;
  dependencies?: NamePath[];
  preserve?: boolean;
  validateFirst?: boolean | "parallel";
  validateDebounce?: number;
  validateTrigger?: string | string[];
  messageVariables?: Record<string, string>;
}

interface FieldEntity {
  getNamePath: () => InternalNamePath;
  getRules: () => FormRuleItem[];
  getConfig: () => FieldConfig;
  onStoreChange: (info: NotifyInfo, prevStore: Store, namePathList?: InternalNamePath[]) => void;
}

interface Callbacks {
  onFinish?: (values: Store) => void;
  onFinishFailed?: (info: ValidateErrorEntity) => void;
  onValuesChange?: (changed: Store, values: Store) => void;
  onFieldsChange?: (changed: FieldData[], all: FieldData[]) => void;
}

interface StoreConfig {
  name?: string;
  preserve?: boolean;
  validateTrigger?: string | string[];
  validateMessages?: ValidateMessages;
  callbacks: Callbacks;
}

interface InternalHooks {
  registerField: (entity: FieldEntity) => () => void;
  initField: (path: InternalNamePath, initialValue: StoreValue) => void;
  updateValue: (path: InternalNamePath, value: StoreValue) => void;
  triggerValidate: (path: InternalNamePath, trigger: string) => void;
  getFieldMeta: (path: InternalNamePath) => FieldMeta;
  getFieldId: (path: InternalNamePath) => string;
  setConfig: (config: StoreConfig) => void;
  setInitialValues: (values: Store | undefined, init: boolean) => void;
  setRootUpdate: (fn: () => void) => void;
  registerWatch: (fn: () => void) => () => void;
  registerNode: (path: InternalNamePath, node: HTMLElement | null) => void;
  destroy: () => void;
}

interface InternalFormInstance extends FormInstance<Store> {
  /** @internal wiring used by Form / Form.Item — not part of the public API */
  _kk: InternalHooks;
}

function createFormStore(): InternalFormInstance {
  let store: Store = {};
  let initialValues: Store = {};
  let entities: FieldEntity[] = [];
  let callbacks: Callbacks = {};
  let validateMessages: ValidateMessages = {};
  let preserveAll = true;
  let formName: string | undefined;
  let rootUpdate: () => void = () => {};

  const metas = new Map<string, FieldMeta>();
  const nodes = new Map<string, HTMLElement>();
  const watchers = new Set<() => void>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const validateIds = new Map<string, number>();

  const getMeta = (path: InternalNamePath): FieldMeta => metas.get(keyOf(path)) ?? EMPTY_META;

  const patchMeta = (path: InternalNamePath, patch: Partial<FieldMeta>) => {
    const key = keyOf(path);
    metas.set(key, { ...(metas.get(key) ?? EMPTY_META), ...patch });
  };

  const notify = (prevStore: Store, namePathList: InternalNamePath[] | undefined, info: NotifyInfo) => {
    entities.slice().forEach((entity) => entity.onStoreChange(info, prevStore, namePathList));
  };

  const notifyWatch = () => watchers.forEach((watcher) => watcher());

  const getFieldData = (path: InternalNamePath): FieldData => {
    const meta = getMeta(path);
    return {
      name: path,
      value: getValue(store, path),
      touched: meta.touched,
      validating: meta.validating,
      errors: meta.errors,
      warnings: meta.warnings,
    };
  };

  const registeredPaths = () => entities.map((entity) => entity.getNamePath()).filter((path) => path.length > 0);

  const notifyFieldsChange = (paths: InternalNamePath[]) => {
    if (!callbacks.onFieldsChange) return;
    callbacks.onFieldsChange(paths.map(getFieldData), registeredPaths().map(getFieldData));
  };

  const findEntity = (path: InternalNamePath) => entities.find((entity) => samePath(entity.getNamePath(), path));

  async function validateEntity(entity: FieldEntity, triggerName?: string): Promise<FieldError> {
    const path = entity.getNamePath();
    const key = keyOf(path);
    const config = entity.getConfig();
    const rules = entity
      .getRules()
      .map((rule) => (typeof rule === "function" ? rule(instance) : rule))
      .filter((rule): rule is FormRule => {
        if (!rule) return false;
        if (!triggerName || rule.validateTrigger === undefined) return true;
        return toArray(rule.validateTrigger).includes(triggerName);
      });

    const runId = (validateIds.get(key) ?? 0) + 1;
    validateIds.set(key, runId);

    if (rules.length === 0) {
      patchMeta(path, { errors: [], warnings: [], validating: false });
      notify(store, [path], { type: "validateFinish" });
      return { name: path, errors: [], warnings: [] };
    }

    const value = getValue(store, path);
    const label =
      typeof config.label === "string" || typeof config.label === "number"
        ? String(config.label)
        : String(path[path.length - 1] ?? "");
    const vars: Record<string, unknown> = {
      label,
      name: path.join("."),
      ...config.messageVariables,
    };

    const isAsync = rules.some((rule) => !!rule.validator);
    if (isAsync) {
      patchMeta(path, { validating: true });
      notify(store, [path], { type: "validateFinish" });
    }

    const errors: React.ReactNode[] = [];
    const warnings: React.ReactNode[] = [];
    const validateFirst = config.validateFirst;

    if (validateFirst === "parallel") {
      const results = await Promise.all(rules.map((rule) => runRule(rule, value, vars, validateMessages)));
      for (let i = 0; i < results.length; i += 1) {
        if (results[i].length) {
          (rules[i].warningOnly ? warnings : errors).push(...results[i]);
          break;
        }
      }
    } else {
      for (const rule of rules) {
        const messages = await runRule(rule, value, vars, validateMessages);
        if (!messages.length) continue;
        (rule.warningOnly ? warnings : errors).push(...messages);
        if (validateFirst === true) break;
      }
    }

    if (validateIds.get(key) !== runId) {
      const current = getMeta(path);
      return { name: path, errors: current.errors, warnings: current.warnings };
    }

    patchMeta(path, { errors, warnings, validating: false });
    notify(store, [path], { type: "validateFinish" });
    notifyFieldsChange([path]);
    return { name: path, errors, warnings };
  }

  const triggerDependencies = (prevStore: Store, path: InternalNamePath) => {
    const children = entities.filter((entity) =>
      (entity.getConfig().dependencies ?? []).some((dep) => samePath(toPath(dep), path)),
    );
    if (!children.length) return;
    const paths = children.map((entity) => entity.getNamePath());
    notify(prevStore, paths, { type: "dependenciesUpdate", relatedFields: [path, ...paths] });
    children.forEach((entity) => {
      if (getMeta(entity.getNamePath()).touched) void validateEntity(entity);
    });
  };

  const updateValue = (path: InternalNamePath, value: StoreValue) => {
    const prevStore = store;
    store = setValue(store, path, value) as Store;
    patchMeta(path, { touched: true });
    notify(prevStore, [path], { type: "valueUpdate" });
    notifyWatch();
    callbacks.onValuesChange?.(setValue({}, path, value) as Store, { ...store });
    notifyFieldsChange([path]);
    triggerDependencies(prevStore, path);
  };

  const instance: InternalFormInstance = {
    getFieldValue: (name) => getValue(store, toPath(name)),

    getFieldsValue: (nameList) => {
      if (!nameList || nameList === true) return { ...store };
      let picked: unknown = {};
      nameList.forEach((name) => {
        const path = toPath(name);
        picked = setValue(picked, path, getValue(store, path));
      });
      return picked as Store;
    },

    setFieldValue: (name, value) => {
      instance.setFields([{ name: toPath(name), value }]);
    },

    setFieldsValue: (values) => {
      const prevStore = store;
      store = mergeStore(store, (values ?? {}) as Store);
      notify(prevStore, undefined, { type: "valueUpdate" });
      notifyWatch();
      rootUpdate();
    },

    setFields: (fields) => {
      const prevStore = store;
      const paths: InternalNamePath[] = [];
      fields.forEach((field) => {
        const path = toPath(field.name);
        paths.push(path);
        if ("value" in field) store = setValue(store, path, field.value) as Store;
        const patch: Partial<FieldMeta> = {};
        if (field.errors !== undefined) patch.errors = field.errors;
        if (field.warnings !== undefined) patch.warnings = field.warnings;
        if (field.touched !== undefined) patch.touched = field.touched;
        if (field.validating !== undefined) patch.validating = field.validating;
        patchMeta(path, patch);
      });
      notify(prevStore, paths, { type: "setField" });
      notifyWatch();
      notifyFieldsChange(paths);
    },

    resetFields: (nameList) => {
      const prevStore = store;
      if (!nameList) {
        store = { ...initialValues };
        entities.forEach((entity) => {
          const path = entity.getNamePath();
          const initial = entity.getConfig().initialValue;
          if (path.length && initial !== undefined && getValue(store, path) === undefined) {
            store = setValue(store, path, initial) as Store;
          }
        });
        metas.clear();
        notify(prevStore, undefined, { type: "reset" });
      } else {
        const paths = nameList.map(toPath);
        paths.forEach((path) => {
          let next = getValue(initialValues, path);
          if (next === undefined) next = findEntity(path)?.getConfig().initialValue;
          store = (next === undefined ? deleteValue(store, path) : setValue(store, path, next)) as Store;
          metas.delete(keyOf(path));
        });
        notify(prevStore, paths, { type: "reset" });
      }
      notifyWatch();
      rootUpdate();
    },

    validateFields: (nameList) => {
      const paths = nameList?.map(toPath);
      const targets = entities.filter((entity) => {
        const path = entity.getNamePath();
        if (!path.length) return false;
        if (!paths) return true;
        return paths.some((target) => isPrefix(target, path) || isPrefix(path, target));
      });

      return Promise.all(targets.map((entity) => validateEntity(entity))).then((results) => {
        const errorFields = results.filter((result) => result.errors.length > 0);
        const values = { ...store };
        if (errorFields.length) {
          const entity: ValidateErrorEntity = { values, errorFields, outOfDate: false };
          return Promise.reject(entity);
        }
        return values;
      });
    },

    submit: () => {
      instance.validateFields().then(
        (values) => callbacks.onFinish?.(values),
        (error: ValidateErrorEntity) => callbacks.onFinishFailed?.(error),
      );
    },

    getFieldError: (name) => getMeta(toPath(name)).errors,
    getFieldWarning: (name) => getMeta(toPath(name)).warnings,

    getFieldsError: (nameList) => {
      const paths = nameList ? nameList.map(toPath) : registeredPaths();
      return paths.map((path) => {
        const meta = getMeta(path);
        return { name: path, errors: meta.errors, warnings: meta.warnings };
      });
    },

    isFieldTouched: (name) => getMeta(toPath(name)).touched,

    isFieldsTouched: (nameList, allTouched) => {
      const list = typeof nameList === "boolean" ? undefined : nameList;
      const every = typeof nameList === "boolean" ? nameList : allTouched;
      const paths = list ? list.map(toPath) : registeredPaths();
      if (!paths.length) return false;
      return every ? paths.every((path) => getMeta(path).touched) : paths.some((path) => getMeta(path).touched);
    },

    isFieldValidating: (name) => getMeta(toPath(name)).validating,

    isFieldsValidating: (nameList) => {
      const paths = nameList ? nameList.map(toPath) : registeredPaths();
      return paths.some((path) => getMeta(path).validating);
    },

    scrollToField: (name, options) => {
      const path = toPath(name);
      const node =
        nodes.get(keyOf(path)) ??
        (typeof document === "undefined" ? null : document.getElementById(fieldIdOf(path, formName)));
      node?.scrollIntoView({ behavior: "smooth", block: "center", ...options });
    },

    _kk: {
      registerField: (entity) => {
        entities.push(entity);
        return () => {
          entities = entities.filter((item) => item !== entity);
          const path = entity.getNamePath();
          if (!path.length) return;
          const key = keyOf(path);
          if (entities.some((item) => keyOf(item.getNamePath()) === key)) return;
          metas.delete(key);
          nodes.delete(key);
          const timer = timers.get(key);
          if (timer) {
            clearTimeout(timer);
            timers.delete(key);
          }
          if (entity.getConfig().preserve ?? preserveAll) return;
          const prevStore = store;
          store = deleteValue(store, path) as Store;
          notify(prevStore, [path], { type: "valueUpdate" });
          notifyWatch();
        };
      },

      initField: (path, initialValue) => {
        if (!path.length || initialValue === undefined) return;
        if (getValue(store, path) !== undefined) return;
        store = setValue(store, path, initialValue) as Store;
      },

      updateValue,

      triggerValidate: (path, trigger) => {
        const entity = findEntity(path);
        if (!entity) return;
        const debounce = entity.getConfig().validateDebounce;
        if (!debounce) {
          void validateEntity(entity, trigger);
          return;
        }
        const key = keyOf(path);
        const previous = timers.get(key);
        if (previous) clearTimeout(previous);
        timers.set(
          key,
          setTimeout(() => {
            timers.delete(key);
            void validateEntity(entity, trigger);
          }, debounce),
        );
      },

      getFieldMeta: getMeta,
      getFieldId: (path) => fieldIdOf(path, formName),

      setConfig: (config) => {
        callbacks = config.callbacks;
        validateMessages = config.validateMessages ?? {};
        preserveAll = config.preserve ?? true;
        formName = config.name;
      },

      setInitialValues: (values, init) => {
        initialValues = values ?? {};
        if (init) store = mergeStore(store, initialValues);
      },

      setRootUpdate: (fn) => {
        rootUpdate = fn;
      },

      registerWatch: (fn) => {
        watchers.add(fn);
        return () => {
          watchers.delete(fn);
        };
      },

      registerNode: (path, node) => {
        const key = keyOf(path);
        if (node) nodes.set(key, node);
        else nodes.delete(key);
      },

      destroy: () => {
        store = {};
        initialValues = {};
        metas.clear();
        nodes.clear();
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
      },
    },
  };

  return instance;
}

/* ------------------------------------------------------------------ */
/* contexts + hooks                                                    */
/* ------------------------------------------------------------------ */

interface FieldContextValue {
  form: InternalFormInstance;
  name?: string;
  layout: FormLayout;
  size?: FormSize;
  variant?: FormVariant;
  disabled: boolean;
  colon: boolean;
  labelAlign: FormLabelAlign;
  labelWrap: boolean;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  requiredMark: RequiredMark;
  validateTrigger: string | string[];
  feedbackIcons?: FeedbackIcons;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);
const PrefixNameContext = React.createContext<InternalNamePath>(EMPTY_PATH);

interface SubMeta {
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
}
const NoStyleReportContext = React.createContext<((key: string, meta: SubMeta | null) => void) | null>(null);

interface FormProviderContextValue {
  registerForm: (name: string, form: FormInstance) => void;
  unregisterForm: (name: string) => void;
  triggerFormChange: (name: string, changedFields: FieldData[]) => void;
  triggerFormFinish: (name: string, values: Store) => void;
}
const FormProviderContext = React.createContext<FormProviderContextValue | null>(null);

/** Create (or adopt) a form instance. `const [form] = Form.useForm()` */
export function useForm<Values = Store>(form?: FormInstance<Values>): [FormInstance<Values>] {
  const ref = React.useRef<FormInstance<Values> | null>(null);
  if (!ref.current) {
    ref.current = form ?? (createFormStore() as unknown as FormInstance<Values>);
  }
  return [ref.current];
}

/** The instance of the closest `<Form>`. */
export function useFormInstance<Values = Store>(): FormInstance<Values> {
  const ctx = React.useContext(FieldContext);
  if (!ctx) throw new Error("useFormInstance() must be called inside a <Form>.");
  return ctx.form as unknown as FormInstance<Values>;
}

/** Subscribe to one value (or a selector over all values) without re-rendering the whole form. */
export function useWatch<T = StoreValue>(dependency: NamePath | ((values: Store) => T), form?: FormInstance): T {
  const ctx = React.useContext(FieldContext);
  const instance = (form ?? ctx?.form) as InternalFormInstance | undefined;

  const depRef = React.useRef(dependency);
  depRef.current = dependency;

  const compute = React.useCallback((): T => {
    if (!instance) return undefined as T;
    const dep = depRef.current;
    if (typeof dep === "function") return dep(instance.getFieldsValue());
    return instance.getFieldValue(dep) as T;
  }, [instance]);

  const [value, setValue_] = React.useState<T>(() => compute());

  React.useEffect(() => {
    if (!instance) return;
    const sync = () => setValue_((prev) => (Object.is(prev, compute()) ? prev : compute()));
    sync();
    return instance._kk.registerWatch(sync);
  }, [instance, compute]);

  return value;
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

export interface FormProps<Values extends Store = Store>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children" | "name"> {
  /** Instance from `Form.useForm()` */
  form?: FormInstance<Values>;
  /** Form name — prefixes field ids and identifies the form in `Form.Provider` */
  name?: string;
  layout?: FormLayout;
  /** Applied to labels/spacing and forwarded to child controls */
  size?: FormSize;
  /** Forwarded to child controls */
  variant?: FormVariant;
  disabled?: boolean;
  /** Default label column (horizontal layout, 24 columns) */
  labelCol?: ColProps;
  /** Default control column (horizontal layout, 24 columns) */
  wrapperCol?: ColProps;
  labelAlign?: FormLabelAlign;
  /** Let long labels wrap instead of staying on one line */
  labelWrap?: boolean;
  /** Show a colon after labels (horizontal layout) */
  colon?: boolean;
  requiredMark?: RequiredMark;
  /** Scroll to the first failing field on submit */
  scrollToFirstError?: boolean | ScrollIntoViewOptions;
  /** Message templates shared by every rule of this form */
  validateMessages?: ValidateMessages;
  /** Default trigger(s) that run validation */
  validateTrigger?: string | string[];
  initialValues?: Partial<Values>;
  /** Keep values of unmounted fields (default true) */
  preserve?: boolean;
  /** Element to render — `false` renders no wrapper at all */
  component?: false | string | React.ComponentType<Record<string, unknown>>;
  /** Custom icons for `hasFeedback` */
  feedbackIcons?: FeedbackIcons;
  /** Wipe the store when the Form unmounts */
  clearOnDestroy?: boolean;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (info: ValidateErrorEntity<Values>) => void;
  onValuesChange?: (changedValues: Partial<Values>, values: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Form<Values extends Store = Store>({
  form,
  name,
  layout = "horizontal",
  size,
  variant,
  disabled = false,
  labelCol,
  wrapperCol,
  labelAlign = "right",
  labelWrap = false,
  colon = true,
  requiredMark = true,
  scrollToFirstError = false,
  validateMessages,
  validateTrigger = "onChange",
  initialValues,
  preserve = true,
  component,
  feedbackIcons,
  clearOnDestroy = false,
  onFinish,
  onFinishFailed,
  onValuesChange,
  onFieldsChange,
  onReset,
  children,
  className,
  ...rest
}: FormProps<Values>) {
  const [formInstance] = useForm<Values>(form);
  const internal = formInstance as unknown as InternalFormInstance;
  const [, forceRootUpdate] = React.useReducer((count: number) => count + 1, 0);
  const provider = React.useContext(FormProviderContext);
  const mounted = React.useRef(false);

  internal._kk.setRootUpdate(forceRootUpdate);
  internal._kk.setConfig({
    name,
    preserve,
    validateTrigger,
    validateMessages,
    callbacks: {
      onFinish: (values) => {
        onFinish?.(values as Values);
        if (name) provider?.triggerFormFinish(name, values);
      },
      onFinishFailed: (info) => {
        if (scrollToFirstError && info.errorFields.length) {
          formInstance.scrollToField(
            info.errorFields[0].name,
            typeof scrollToFirstError === "object" ? scrollToFirstError : undefined,
          );
        }
        onFinishFailed?.(info as ValidateErrorEntity<Values>);
      },
      onValuesChange: onValuesChange
        ? (changed, values) => onValuesChange(changed as Partial<Values>, values as Values)
        : undefined,
      onFieldsChange:
        onFieldsChange || (name && provider)
          ? (changed, all) => {
              onFieldsChange?.(changed, all);
              if (name) provider?.triggerFormChange(name, changed);
            }
          : undefined,
    },
  });
  internal._kk.setInitialValues(initialValues as Store | undefined, !mounted.current);
  mounted.current = true;

  React.useEffect(() => {
    if (!provider || !name) return;
    provider.registerForm(name, formInstance as unknown as FormInstance);
    return () => provider.unregisterForm(name);
  }, [provider, name, formInstance]);

  React.useEffect(
    () => () => {
      if (clearOnDestroy) internal._kk.destroy();
    },
    [clearOnDestroy, internal],
  );

  const context: FieldContextValue = {
    form: internal,
    name,
    layout,
    size,
    variant,
    disabled,
    colon,
    labelAlign,
    labelWrap,
    labelCol,
    wrapperCol,
    requiredMark,
    validateTrigger,
    feedbackIcons,
  };

  const inner = (
    <FieldContext.Provider value={context}>
      <PrefixNameContext.Provider value={EMPTY_PATH}>{children}</PrefixNameContext.Provider>
    </FieldContext.Provider>
  );

  if (component === false) return inner;

  const Component = (component ?? "form") as unknown as React.FunctionComponent<Record<string, unknown>>;

  return (
    <Component
      {...rest}
      data-slot="form"
      name={name}
      id={name}
      className={cn(
        "w-full text-sm",
        layout === "inline" && "flex flex-wrap items-start gap-x-4",
        size === "lg" && "text-base",
        className,
      )}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        formInstance.submit();
      }}
      onReset={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formInstance.resetFields();
        onReset?.(event);
      }}
    >
      {inner}
    </Component>
  );
}

/* ------------------------------------------------------------------ */
/* Form.Item                                                           */
/* ------------------------------------------------------------------ */

export interface FormItemProps {
  name?: NamePath;
  label?: React.ReactNode;
  rules?: FormRuleItem[];
  /** Fallback value when the Form has no `initialValues` entry for this field */
  initialValue?: StoreValue;
  /** Prop the value is written to (e.g. `checked` for Checkbox / Switch) */
  valuePropName?: string;
  /** Prop that reports changes back */
  trigger?: string;
  /** Event(s) that run validation — defaults to the Form's `validateTrigger` */
  validateTrigger?: string | string[];
  /** Pull the value out of the trigger arguments */
  getValueFromEvent?: (...args: unknown[]) => StoreValue;
  /** Extra props derived from the value (replaces `valuePropName`) */
  getValueProps?: (value: StoreValue) => Record<string, unknown>;
  /** Normalise the value before it enters the store */
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
  /** Stop at the first failing rule (`"parallel"` runs them all at once) */
  validateFirst?: boolean | "parallel";
  /** Debounce trigger-based validation (ms) */
  validateDebounce?: number;
  /** Extra variables for message templates */
  messageVariables?: Record<string, string>;
  /** Keep the value when the item unmounts */
  preserve?: boolean;
  /** Re-render + re-validate when these fields change */
  dependencies?: NamePath[];
  /** Re-render on any value change (or when the function returns true) */
  shouldUpdate?: ShouldUpdate;
  /** Render only the control — errors bubble to the parent item */
  noStyle?: boolean;
  /** Keep the field registered but hide it */
  hidden?: boolean;
  /** Show a status icon next to the control */
  hasFeedback?: boolean | { icons: FeedbackIcons };
  tooltip?: React.ReactNode | { title: React.ReactNode; icon?: React.ReactNode };
  colon?: boolean;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  labelAlign?: FormLabelAlign;
  /** `for` of the label — defaults to the generated control id */
  htmlFor?: string;
  extra?: React.ReactNode;
  /** Replaces the auto error message */
  help?: React.ReactNode;
  required?: boolean;
  validateStatus?: ValidateStatus;
  children?: React.ReactNode | ((form: FormInstance) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

const STATUS_TEXT: Record<ValidateStatus, string> = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  validating: "text-text-tertiary",
};

const DEFAULT_FEEDBACK: Record<ValidateStatus, React.ReactNode> = {
  success: <CircleCheck className="size-4 text-success" />,
  warning: <CircleAlert className="size-4 text-warning" />,
  error: <CircleX className="size-4 text-error" />,
  validating: <LoaderCircle className="size-4 animate-spin text-primary" />,
};

const ITEM_GAP: Record<FormSize, string> = { sm: "mb-4", md: "mb-5", lg: "mb-6" };
const LABEL_HEIGHT: Record<FormSize, string> = { sm: "min-h-control-sm", md: "min-h-control", lg: "min-h-control-lg" };

function colStyle(col: ColProps): React.CSSProperties | undefined {
  if (col.span === undefined && col.offset === undefined) return undefined;
  return {
    flex: col.span === undefined ? undefined : `0 0 ${(col.span / 24) * 100}%`,
    maxWidth: col.span === undefined ? undefined : `${(col.span / 24) * 100}%`,
    marginLeft: col.offset === undefined ? undefined : `${(col.offset / 24) * 100}%`,
  };
}

function defaultGetValueFromEvent(valuePropName: string, args: unknown[]): StoreValue {
  const event = args[0];
  if (event && typeof event === "object" && "target" in event) {
    const target = (event as { target: unknown }).target;
    if (target && typeof target === "object") {
      const record = target as Record<string, unknown>;
      return valuePropName === "checked" ? record.checked : record.value;
    }
  }
  return event;
}

function messageSignature(nodes: React.ReactNode[]): string {
  return nodes.map((node) => (typeof node === "string" || typeof node === "number" ? String(node) : "node")).join("|");
}

export function FormItem(props: FormItemProps) {
  const {
    name,
    label,
    valuePropName = "value",
    trigger = "onChange",
    noStyle = false,
    hidden = false,
    hasFeedback = false,
    tooltip,
    extra,
    help,
    required,
    validateStatus,
    children,
    className,
    style,
    htmlFor,
    dependencies,
    shouldUpdate,
    getValueFromEvent,
    getValueProps,
    normalize,
    initialValue,
    rules,
  } = props;

  const ctx = React.useContext(FieldContext);
  const prefix = React.useContext(PrefixNameContext);
  const reportToParent = React.useContext(NoStyleReportContext);
  const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

  const form = ctx?.form;
  const namePath = name === undefined ? EMPTY_PATH : [...prefix, ...toPath(name)];
  const fieldKey = keyOf(namePath);

  const propsRef = React.useRef(props);
  propsRef.current = props;
  const pathRef = React.useRef(namePath);
  pathRef.current = namePath;
  const formRef = React.useRef(form);
  formRef.current = form;

  const inited = React.useRef(false);
  if (form && !inited.current) {
    inited.current = true;
    form._kk.initField(namePath, initialValue);
  }

  const entityRef = React.useRef<FieldEntity | null>(null);
  if (!entityRef.current) {
    entityRef.current = {
      getNamePath: () => pathRef.current,
      getRules: () => propsRef.current.rules ?? [],
      getConfig: () => ({
        label: propsRef.current.label,
        initialValue: propsRef.current.initialValue,
        dependencies: propsRef.current.dependencies,
        preserve: propsRef.current.preserve,
        validateFirst: propsRef.current.validateFirst,
        validateDebounce: propsRef.current.validateDebounce,
        validateTrigger: propsRef.current.validateTrigger,
        messageVariables: propsRef.current.messageVariables,
      }),
      onStoreChange: (info, prevStore, namePathList) => {
        const path = pathRef.current;
        const current = propsRef.current;
        const deps = current.dependencies ?? [];
        const update = current.shouldUpdate;
        let hit = false;

        if (info.type === "dependenciesUpdate") {
          hit =
            containsPath(info.relatedFields, path) ||
            deps.some((dep) => containsPath(info.relatedFields, toPath(dep)));
        } else if (!namePathList) {
          hit = true;
        } else if (path.length > 0 && containsPath(namePathList, path)) {
          hit = true;
        } else if (deps.some((dep) => containsPath(namePathList, toPath(dep)))) {
          hit = true;
        } else if (update === true) {
          hit = true;
        } else if (typeof update === "function" && formRef.current) {
          hit = update(prevStore, formRef.current.getFieldsValue(), { source: info.type });
        }

        if (hit) forceUpdate();
      },
    };
  }

  const bound = namePath.length > 0;
  const observing = bound || !!shouldUpdate || !!dependencies;

  React.useEffect(() => {
    if (!form || !observing) return;
    return form._kk.registerField(entityRef.current!);
  }, [form, observing, fieldKey]);

  /* --- meta ---------------------------------------------------------- */

  const meta = form && bound ? form._kk.getFieldMeta(namePath) : EMPTY_META;
  const [subMetas, setSubMetas] = React.useState<Record<string, SubMeta>>({});

  const report = React.useCallback((key: string, sub: SubMeta | null) => {
    setSubMetas((prev) => {
      if (!sub) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: sub };
    });
  }, []);

  const subList = Object.values(subMetas);
  const errors = subList.length ? [...meta.errors, ...subList.flatMap((sub) => sub.errors)] : meta.errors;
  const warnings = subList.length ? [...meta.warnings, ...subList.flatMap((sub) => sub.warnings)] : meta.warnings;

  const metaRef = React.useRef<SubMeta>({ errors, warnings });
  metaRef.current = { errors, warnings };
  const signature = `${messageSignature(errors)}#${messageSignature(warnings)}`;

  React.useEffect(() => {
    if (!noStyle || !reportToParent) return;
    reportToParent(fieldKey, metaRef.current);
    return () => reportToParent(fieldKey, null);
    // signature keeps the parent in sync whenever the messages change
  }, [noStyle, reportToParent, fieldKey, signature]);

  const status: ValidateStatus | undefined =
    validateStatus ??
    (meta.validating ? "validating" : errors.length ? "error" : warnings.length ? "warning" : undefined);

  /* --- control ------------------------------------------------------- */

  const controlId = htmlFor ?? (form ? form._kk.getFieldId(namePath) : namePath.join("_"));
  const value = form && bound ? form.getFieldValue(namePath) : undefined;

  let childNode: React.ReactNode;
  if (typeof children === "function") {
    childNode = form ? children(form as unknown as FormInstance) : null;
  } else if (ctx && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps: Record<string, unknown> = { ...child.props };
    const boolControl = valuePropName === "checked";

    // Form-wide presentation only goes to real components — never onto a DOM tag.
    if (typeof child.type !== "string") {
      if (ctx.disabled) childProps.disabled = true;
      if (status === "error" || status === "warning") childProps.status = status;
      if (ctx.size && !boolControl && childProps.size === undefined) childProps.size = ctx.size;
      if (ctx.variant && !boolControl && childProps.variant === undefined) childProps.variant = ctx.variant;
    }

    if (form && bound) {
      Object.assign(childProps, getValueProps ? getValueProps(value) : { [valuePropName]: value });
      if (childProps.id === undefined) childProps.id = controlId;

      const validateTriggers = toArray(props.validateTrigger ?? ctx.validateTrigger);
      const originals: Record<string, unknown> = { [trigger]: childProps[trigger] };
      validateTriggers.forEach((item) => {
        originals[item] = childProps[item];
      });

      const callOriginal = (key: string, args: unknown[]) => {
        const handler = originals[key] as ((...values: unknown[]) => void) | undefined;
        handler?.(...args);
      };

      childProps[trigger] = (...args: unknown[]) => {
        const raw = getValueFromEvent ? getValueFromEvent(...args) : defaultGetValueFromEvent(valuePropName, args);
        const next = normalize ? normalize(raw, value, form.getFieldsValue()) : raw;
        form._kk.updateValue(namePath, next);
        callOriginal(trigger, args);
        if (validateTriggers.includes(trigger)) form._kk.triggerValidate(namePath, trigger);
      };

      validateTriggers
        .filter((item) => item !== trigger)
        .forEach((item) => {
          childProps[item] = (...args: unknown[]) => {
            callOriginal(item, args);
            form._kk.triggerValidate(namePath, item);
          };
        });
    }

    childNode = React.cloneElement(child, childProps);
  } else {
    childNode = children;
  }

  const wrappedChild = <NoStyleReportContext.Provider value={report}>{childNode}</NoStyleReportContext.Provider>;

  const nodeRef = React.useCallback((node: HTMLDivElement | null) => {
    formRef.current?._kk.registerNode(pathRef.current, node);
  }, []);

  if (noStyle) return <>{wrappedChild}</>;

  /* --- layout -------------------------------------------------------- */

  const layout = ctx?.layout ?? "horizontal";
  const size = ctx?.size ?? "md";
  const isVertical = layout === "vertical";
  const isInline = layout === "inline";
  const isHorizontal = !isVertical && !isInline;

  const mergedColon = props.colon ?? ctx?.colon ?? true;
  const mergedLabelAlign = props.labelAlign ?? ctx?.labelAlign ?? "right";
  const mergedLabelCol = props.labelCol ?? ctx?.labelCol;
  const mergedWrapperCol = props.wrapperCol ?? ctx?.wrapperCol;
  const requiredMark = ctx?.requiredMark ?? true;

  const isRequired =
    required ?? (rules ?? []).some((rule) => typeof rule === "object" && rule !== null && rule.required === true);

  const tooltipConfig =
    tooltip && typeof tooltip === "object" && !React.isValidElement(tooltip) && "title" in tooltip
      ? (tooltip as { title: React.ReactNode; icon?: React.ReactNode })
      : null;
  const tooltipTitle: React.ReactNode = tooltipConfig ? tooltipConfig.title : (tooltip as React.ReactNode);

  let labelInner: React.ReactNode = (
    <>
      {label}
      {tooltipTitle != null && tooltipTitle !== false && (
        <Tooltip title={tooltipTitle}>
          <span className="ml-1 inline-flex cursor-help text-text-tertiary transition-colors duration-mid hover:text-text-secondary">
            {tooltipConfig?.icon ?? <CircleHelp className="size-3.5" />}
          </span>
        </Tooltip>
      )}
      {isHorizontal && mergedColon && ":"}
    </>
  );

  if (typeof requiredMark === "function") {
    labelInner = requiredMark(labelInner, { required: isRequired });
  } else if (requiredMark === "optional") {
    labelInner = (
      <>
        {labelInner}
        {!isRequired && <span className="ml-1 text-xs text-text-tertiary">(optional)</span>}
      </>
    );
  } else if (requiredMark !== false && isRequired) {
    labelInner = (
      <>
        <span aria-hidden className="mr-1 text-error">
          *
        </span>
        {labelInner}
      </>
    );
  }

  const labelNode =
    label === undefined || label === null ? null : (
      <label
        htmlFor={controlId}
        className={cn(
          "shrink-0 select-none text-text",
          size === "lg" ? "text-base" : "text-sm",
          isHorizontal
            ? cn(
                "flex items-center",
                LABEL_HEIGHT[size],
                mergedLabelAlign === "right" ? "justify-end text-right" : "justify-start text-left",
              )
            : "mb-1 inline-flex items-center",
          ctx?.labelWrap ? "break-words whitespace-normal" : "whitespace-nowrap",
          ctx?.disabled && "text-text-disabled",
        )}
        style={isHorizontal && mergedLabelCol ? colStyle(mergedLabelCol) : undefined}
      >
        {labelInner}
      </label>
    );

  const feedbackIcons = typeof hasFeedback === "object" ? hasFeedback.icons : ctx?.feedbackIcons;
  const feedbackNode =
    hasFeedback && status ? (
      <span key={status} className="kk-in kk-in-zoom flex shrink-0 items-center">
        {(feedbackIcons ? { ...DEFAULT_FEEDBACK, ...feedbackIcons({ status, errors, warnings }) } : DEFAULT_FEEDBACK)[
          status
        ]}
      </span>
    ) : null;

  const control = feedbackNode ? (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">{wrappedChild}</div>
      {feedbackNode}
    </div>
  ) : (
    wrappedChild
  );

  const helpNode =
    help !== undefined && help !== null ? (
      <div className={cn("mt-1 text-xs", status ? STATUS_TEXT[status] : "text-text-tertiary")}>{help}</div>
    ) : (
      <FormErrorList errors={errors} warnings={warnings} />
    );

  return (
    <div
      ref={nodeRef}
      data-slot="form-item"
      data-status={status}
      className={cn(
        isInline ? "inline-flex items-start gap-2" : isHorizontal ? "flex items-start gap-2" : "flex flex-col",
        !isInline && cn(ITEM_GAP[size], "last:mb-0"),
        className,
      )}
      style={hidden ? { ...style, display: "none" } : style}
    >
      {labelNode}
      <div
        className={isHorizontal ? "min-w-0 flex-1" : isInline ? "min-w-0" : "w-full"}
        style={isHorizontal && mergedWrapperCol ? colStyle(mergedWrapperCol) : undefined}
      >
        {control}
        {helpNode}
        {extra != null && <div className="mt-1 text-xs text-text-tertiary">{extra}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form.ErrorList                                                      */
/* ------------------------------------------------------------------ */

export interface FormErrorListProps {
  errors?: React.ReactNode[];
  warnings?: React.ReactNode[];
  className?: string;
}

export function FormErrorList({ errors = [], warnings = [], className }: FormErrorListProps) {
  if (!errors.length && !warnings.length) return null;
  return (
    <div data-slot="form-error-list" className={cn("mt-1 space-y-0.5 text-xs", className)}>
      {errors.map((error, index) => (
        <div key={`error-${index}`} className="kk-in kk-in-up text-error">
          {error}
        </div>
      ))}
      {warnings.map((warning, index) => (
        <div key={`warning-${index}`} className="kk-in kk-in-up text-warning">
          {warning}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form.List                                                           */
/* ------------------------------------------------------------------ */

export interface FormListFieldData {
  /** Stable React key — survives insert / remove / move */
  key: number;
  /** Index inside the list, use it as the name prefix of the inner items */
  name: number;
}

export interface FormListOperation {
  add: (defaultValue?: StoreValue, insertIndex?: number) => void;
  remove: (index: number | number[]) => void;
  move: (from: number, to: number) => void;
}

export interface FormListProps {
  name: NamePath;
  initialValue?: StoreValue[];
  /** Rules validated against the whole array (surface them with `Form.ErrorList`) */
  rules?: FormRuleItem[];
  children: (
    fields: FormListFieldData[],
    operation: FormListOperation,
    meta: { errors: React.ReactNode[]; warnings: React.ReactNode[] },
  ) => React.ReactNode;
}

export function FormList({ name, initialValue, rules, children }: FormListProps) {
  const ctx = React.useContext(FieldContext);
  const prefix = React.useContext(PrefixNameContext);
  const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

  const form = ctx?.form;
  const namePath = [...prefix, ...toPath(name)];
  const fieldKey = keyOf(namePath);

  const pathRef = React.useRef(namePath);
  pathRef.current = namePath;
  const rulesRef = React.useRef(rules);
  rulesRef.current = rules;
  const initialRef = React.useRef(initialValue);
  initialRef.current = initialValue;
  const formRef = React.useRef(form);
  formRef.current = form;

  const keyManager = React.useRef({ keys: [] as number[], id: 0 }).current;

  const inited = React.useRef(false);
  if (form && !inited.current) {
    inited.current = true;
    form._kk.initField(namePath, initialValue);
  }

  const entityRef = React.useRef<FieldEntity | null>(null);
  if (!entityRef.current) {
    entityRef.current = {
      getNamePath: () => pathRef.current,
      getRules: () => rulesRef.current ?? [],
      getConfig: () => ({ initialValue: initialRef.current }),
      onStoreChange: (_info, _prevStore, namePathList) => {
        if (!namePathList || containsPath(namePathList, pathRef.current)) forceUpdate();
      },
    };
  }

  React.useEffect(() => {
    if (!form) return;
    return form._kk.registerField(entityRef.current!);
  }, [form, fieldKey]);

  const raw = form?.getFieldValue(namePath);
  const list = Array.isArray(raw) ? raw : [];
  const meta = form ? form._kk.getFieldMeta(namePath) : EMPTY_META;

  const fields = list.map((_item, index) => {
    if (keyManager.keys[index] === undefined) {
      keyManager.keys[index] = keyManager.id;
      keyManager.id += 1;
    }
    return { name: index, key: keyManager.keys[index] };
  });

  const operation = React.useMemo<FormListOperation>(() => {
    const currentList = () => {
      const value = formRef.current?.getFieldValue(pathRef.current);
      return Array.isArray(value) ? [...value] : [];
    };
    const commit = (next: StoreValue[]) => formRef.current?._kk.updateValue(pathRef.current, next);

    return {
      add: (defaultValue, insertIndex) => {
        const next = currentList();
        const at = insertIndex === undefined ? next.length : Math.max(0, Math.min(insertIndex, next.length));
        next.splice(at, 0, defaultValue);
        keyManager.keys = [...keyManager.keys.slice(0, at), keyManager.id, ...keyManager.keys.slice(at)];
        keyManager.id += 1;
        commit(next);
      },
      remove: (index) => {
        const drop = new Set(Array.isArray(index) ? index : [index]);
        const next = currentList().filter((_item, i) => !drop.has(i));
        keyManager.keys = keyManager.keys.filter((_key, i) => !drop.has(i));
        commit(next);
      },
      move: (from, to) => {
        const next = currentList();
        if (from === to || from < 0 || to < 0 || from >= next.length || to >= next.length) return;
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        const keys = [...keyManager.keys];
        const [movedKey] = keys.splice(from, 1);
        keys.splice(to, 0, movedKey);
        keyManager.keys = keys;
        commit(next);
      },
    };
  }, [keyManager]);

  return (
    <PrefixNameContext.Provider value={namePath}>
      {children(fields, operation, { errors: meta.errors, warnings: meta.warnings })}
    </PrefixNameContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Form.Provider                                                       */
/* ------------------------------------------------------------------ */

export interface FormProviderProps {
  onFormChange?: (name: string, info: { changedFields: FieldData[]; forms: Record<string, FormInstance> }) => void;
  onFormFinish?: (name: string, info: { values: Store; forms: Record<string, FormInstance> }) => void;
  children?: React.ReactNode;
}

export function FormProvider({ onFormChange, onFormFinish, children }: FormProviderProps) {
  const forms = React.useRef<Record<string, FormInstance>>({});
  const handlers = React.useRef({ onFormChange, onFormFinish });
  handlers.current = { onFormChange, onFormFinish };

  const value = React.useMemo<FormProviderContextValue>(
    () => ({
      registerForm: (name, form) => {
        forms.current[name] = form;
      },
      unregisterForm: (name) => {
        delete forms.current[name];
      },
      triggerFormChange: (name, changedFields) =>
        handlers.current.onFormChange?.(name, { changedFields, forms: forms.current }),
      triggerFormFinish: (name, values) => handlers.current.onFormFinish?.(name, { values, forms: forms.current }),
    }),
    [],
  );

  return <FormProviderContext.Provider value={value}>{children}</FormProviderContext.Provider>;
}

/* ------------------------------------------------------------------ */

Form.Item = FormItem;
Form.List = FormList;
Form.ErrorList = FormErrorList;
Form.Provider = FormProvider;
Form.useForm = useForm;
Form.useWatch = useWatch;
Form.useFormInstance = useFormInstance;
