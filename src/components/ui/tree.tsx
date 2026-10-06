import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Loader2,
  Minus,
  Check,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Key = string | number;

export interface DataNode {
  key: Key;
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
  children?: DataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  isLeaf?: boolean;
  icon?: React.ReactNode | ((props: TreeNodeRenderProps) => React.ReactNode);
  checkable?: boolean;
  switcherIcon?: React.ReactNode | ((props: TreeNodeRenderProps) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export interface TreeNodeRenderProps {
  node: DataNode;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  loading: boolean;
  isLeaf: boolean;
}

export interface TreeFieldNames {
  title?: string;
  key?: string;
  children?: string;
}

export interface CheckInfo {
  checked: boolean;
  checkedNodes: DataNode[];
  node: DataNode;
  event: React.MouseEvent | React.KeyboardEvent;
  halfCheckedKeys?: Key[];
}

export interface SelectInfo {
  selected: boolean;
  selectedNodes: DataNode[];
  node: DataNode;
  event: React.MouseEvent | React.KeyboardEvent;
  nativeEvent?: MouseEvent;
}

export interface ExpandInfo {
  expanded: boolean;
  node: DataNode;
}

export interface TreeProps
  extends Omit<
    React.ComponentProps<"div">,
    "onSelect" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "draggable" | "onDoubleClick"
  > {
  treeData?: DataNode[];
  fieldNames?: TreeFieldNames;
  checkable?: boolean;
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultCheckedKeys?: Key[];
  checkStrictly?: boolean;
  onCheck?: (checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }, info: CheckInfo) => void;
  selectedKeys?: Key[];
  defaultSelectedKeys?: Key[];
  multiple?: boolean;
  onSelect?: (selectedKeys: Key[], info: SelectInfo) => void;
  expandedKeys?: Key[];
  defaultExpandedKeys?: Key[];
  defaultExpandAll?: boolean;
  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  onExpand?: (expandedKeys: Key[], info: ExpandInfo) => void;
  showLine?: boolean | { showLeafIcon?: boolean | React.ReactNode | ((props: TreeNodeRenderProps) => React.ReactNode) };
  showIcon?: boolean;
  switcherIcon?: React.ReactNode | ((props: TreeNodeRenderProps) => React.ReactNode);
  blockNode?: boolean;
  draggable?: boolean | { icon?: React.ReactNode | false; nodeDraggable?: (node: DataNode) => boolean };
  allowDrop?: (info: { dragNode: DataNode; dropNode: DataNode; dropPosition: -1 | 0 | 1 }) => boolean;
  onDragStart?: (info: { event: React.DragEvent<HTMLDivElement>; node: DataNode }) => void;
  onDragEnter?: (info: { event: React.DragEvent<HTMLDivElement>; node: DataNode; expandedKeys: Key[] }) => void;
  onDragOver?: (info: { event: React.DragEvent<HTMLDivElement>; node: DataNode }) => void;
  onDragLeave?: (info: { event: React.DragEvent<HTMLDivElement>; node: DataNode }) => void;
  onDragEnd?: (info: { event: React.DragEvent<HTMLDivElement>; node: DataNode }) => void;
  onDrop?: (info: {
    event: React.DragEvent<HTMLDivElement>;
    node: DataNode;
    dragNode: DataNode;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => void;
  loadData?: (node: DataNode) => Promise<void>;
  loadedKeys?: Key[];
  titleRender?: (node: DataNode) => React.ReactNode;
  filterTreeNode?: (node: DataNode) => boolean;
  height?: number;
  /** Row height used by the windowed renderer when `height` is set. */
  itemHeight?: number;
  /** Render every node even with `height` set. */
  virtual?: boolean;
  onRightClick?: (info: { event: React.MouseEvent; node: DataNode }) => void;
  onDoubleClick?: (info: { event: React.MouseEvent; node: DataNode }) => void;
  expandAction?: false | "click" | "doubleClick";
  rootClassName?: string;
  disabled?: boolean;
  directory?: boolean;
}

interface FlattenNode {
  node: DataNode;
  key: Key;
  pos: string;
  level: number;
  parentKey: Key | null;
  childrenKeys: Key[];
  isLeaf: boolean;
  isLast: boolean;
  parentIsLastList: boolean[];
}

function normalizeNode(raw: DataNode, fieldNames?: TreeFieldNames): DataNode {
  const titleKey = fieldNames?.title ?? "title";
  const keyKey = fieldNames?.key ?? "key";
  const childrenKey = fieldNames?.children ?? "children";

  const key = (raw[keyKey] ?? raw.key) as Key;
  const title = (raw[titleKey] ?? raw.title) as React.ReactNode | ((data: DataNode) => React.ReactNode);
  const rawChildren = raw[childrenKey] as DataNode[] | undefined;
  const children = rawChildren ? rawChildren.map((c) => normalizeNode(c, fieldNames)) : undefined;

  return {
    ...raw,
    key,
    title,
    children,
  };
}

function getAllKeys(nodes: DataNode[]): Key[] {
  const keys: Key[] = [];
  function traverse(list: DataNode[]) {
    for (const item of list) {
      keys.push(item.key);
      if (item.children?.length) {
        traverse(item.children);
      }
    }
  }
  traverse(nodes);
  return keys;
}

function flattenTree(
  nodes: DataNode[],
  expandedKeysSet: Set<Key>,
  parentKey: Key | null = null,
  level = 0,
  posPrefix = "0",
  parentIsLastList: boolean[] = []
): FlattenNode[] {
  const result: FlattenNode[] = [];

  nodes.forEach((node, index) => {
    const pos = `${posPrefix}-${index}`;
    const isLast = index === nodes.length - 1;
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isLeaf = node.isLeaf ?? (!hasChildren && !node.children);
    const childrenKeys = node.children ? node.children.map((c) => c.key) : [];

    const flatNode: FlattenNode = {
      node,
      key: node.key,
      pos,
      level,
      parentKey,
      childrenKeys,
      isLeaf,
      isLast,
      parentIsLastList,
    };
    result.push(flatNode);

    if (hasChildren && expandedKeysSet.has(node.key)) {
      result.push(
        ...flattenTree(
          node.children!,
          expandedKeysSet,
          node.key,
          level + 1,
          pos,
          [...parentIsLastList, isLast]
        )
      );
    }
  });

  return result;
}

// Tree entities helper
interface TreeEntities {
  keyEntities: Map<Key, { node: DataNode; parent: Key | null; children: Key[]; level: number; isLeaf: boolean }>;
}

function buildTreeEntities(nodes: DataNode[]): TreeEntities {
  const keyEntities = new Map<Key, { node: DataNode; parent: Key | null; children: Key[]; level: number; isLeaf: boolean }>();

  function traverse(list: DataNode[], parent: Key | null = null, level = 0) {
    for (const node of list) {
      const children = node.children ? node.children.map((c) => c.key) : [];
      const isLeaf = node.isLeaf ?? (!node.children || node.children.length === 0);
      keyEntities.set(node.key, {
        node,
        parent,
        children,
        level,
        isLeaf,
      });
      if (node.children?.length) {
        traverse(node.children, node.key, level + 1);
      }
    }
  }

  traverse(nodes);
  return { keyEntities };
}

function recalculateCheckedState(
  initCheckedKeys: Key[],
  keyEntities: Map<Key, { node: DataNode; parent: Key | null; children: Key[] }>
): { checkedKeys: Key[]; halfCheckedKeys: Key[] } {
  const checkedKeySet = new Set<Key>();
  const halfCheckedKeySet = new Set<Key>();

  // Add initial keys
  for (const k of initCheckedKeys) {
    checkedKeySet.add(k);
    // Also add all descendants
    const entity = keyEntities.get(k);
    if (entity) {
      const queue = [...entity.children];
      while (queue.length > 0) {
        const next = queue.shift()!;
        checkedKeySet.add(next);
        const nextEnt = keyEntities.get(next);
        if (nextEnt) queue.push(...nextEnt.children);
      }
    }
  }

  // Conduct upwards, deepest parents first: a grandparent can only be judged
  // once its own children have settled, which the old "has children" sort never
  // guaranteed beyond two levels.
  const depthOf = (key: Key): number => {
    let depth = 0;
    let cursor = keyEntities.get(key)?.parent ?? null;
    while (cursor !== null) {
      depth += 1;
      cursor = keyEntities.get(cursor)?.parent ?? null;
    }
    return depth;
  };

  const sortedEntities = Array.from(keyEntities.entries()).sort((a, b) => depthOf(b[0]) - depthOf(a[0]));

  for (const [k, entity] of sortedEntities) {
    if (entity.children.length > 0) {
      let allChecked = true;
      let someChecked = false;
      for (const childKey of entity.children) {
        const isChildChecked = checkedKeySet.has(childKey);
        const isChildHalfChecked = halfCheckedKeySet.has(childKey);
        if (!isChildChecked) allChecked = false;
        if (isChildChecked || isChildHalfChecked) someChecked = true;
      }
      if (allChecked) {
        checkedKeySet.add(k);
        halfCheckedKeySet.delete(k);
      } else if (someChecked) {
        checkedKeySet.delete(k);
        halfCheckedKeySet.add(k);
      } else {
        checkedKeySet.delete(k);
        halfCheckedKeySet.delete(k);
      }
    }
  }

  return {
    checkedKeys: Array.from(checkedKeySet),
    halfCheckedKeys: Array.from(halfCheckedKeySet),
  };
}

/** Read `<TreeNode>` children into plain data nodes. */
function nodesFromChildren(children: React.ReactNode): DataNode[] {
  const out: DataNode[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const { children: nested, ...rest } = child.props as DataNode & { children?: React.ReactNode };
    const nestedNodes = nodesFromChildren(nested as React.ReactNode);
    out.push({
      ...(rest as DataNode),
      key: (rest as DataNode).key ?? String(child.key ?? out.length),
      children: nestedNodes.length > 0 ? nestedNodes : undefined,
    });
  });
  return out;
}

function Tree({
  treeData = [],
  fieldNames,
  checkable = false,
  checkedKeys: checkedKeysProp,
  defaultCheckedKeys = [],
  checkStrictly = false,
  onCheck,
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys = [],
  multiple = false,
  onSelect,
  expandedKeys: expandedKeysProp,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  defaultExpandParent = true,
  autoExpandParent = false,
  onExpand,
  showLine = false,
  showIcon = false,
  switcherIcon,
  blockNode = false,
  draggable = false,
  allowDrop,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  loadData,
  loadedKeys: loadedKeysProp,
  titleRender,
  filterTreeNode,
  height,
  itemHeight = 28,
  virtual = true,
  onRightClick,
  onDoubleClick,
  expandAction = false,
  rootClassName,
  disabled = false,
  directory = false,
  className,
  style,
  children,
  ...props
}: TreeProps) {
  // `<Tree><TreeNode …/></Tree>` is the same tree, expressed as JSX.
  const childData = React.useMemo(() => nodesFromChildren(children), [children]);

  const normalizedData = React.useMemo(() => {
    const source = treeData.length > 0 ? treeData : childData;
    return source.map((d) => normalizeNode(d, fieldNames));
  }, [treeData, childData, fieldNames]);

  const treeEntities = React.useMemo(() => {
    return buildTreeEntities(normalizedData);
  }, [normalizedData]);

  // Expanded keys state
  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState<Key[]>(() => {
    if (defaultExpandAll) {
      return getAllKeys(normalizedData);
    }
    return defaultExpandedKeys;
  });
  const expandedKeys = expandedKeysProp ?? innerExpandedKeys;

  /** Every ancestor of the given keys, so a deep key is actually reachable. */
  const withParents = React.useCallback(
    (keys: Key[]): Key[] => {
      const out = new Set(keys);
      for (const key of keys) {
        let cursor = treeEntities.keyEntities.get(key)?.parent ?? null;
        while (cursor !== null) {
          out.add(cursor);
          cursor = treeEntities.keyEntities.get(cursor)?.parent ?? null;
        }
      }
      return Array.from(out);
    },
    [treeEntities],
  );

  // defaultExpandParent runs once against the initial keys; autoExpandParent keeps
  // doing it every time the controlled list changes.
  const didExpandParents = React.useRef(false);
  React.useEffect(() => {
    if (expandedKeysProp !== undefined || defaultExpandAll) return;
    if (!defaultExpandParent || didExpandParents.current || defaultExpandedKeys.length === 0) return;
    didExpandParents.current = true;
    setInnerExpandedKeys((prev) => withParents(prev));
  }, [defaultExpandParent, defaultExpandAll, expandedKeysProp, defaultExpandedKeys.length, withParents]);

  const effectiveExpandedKeys = React.useMemo(
    () => (autoExpandParent ? withParents(expandedKeys) : expandedKeys),
    [autoExpandParent, expandedKeys, withParents],
  );

  const expandedKeysSet = React.useMemo(() => new Set(effectiveExpandedKeys), [effectiveExpandedKeys]);

  // Selected keys state
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<Key[]>(defaultSelectedKeys);
  const selectedKeys = selectedKeysProp ?? innerSelectedKeys;
  const selectedKeysSet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);

  // Checked keys state
  const [innerCheckedKeys, setInnerCheckedKeys] = React.useState<Key[]>(defaultCheckedKeys);

  // Calculate checked / halfChecked keys
  const { checkedKeyList, halfCheckedKeyList } = React.useMemo(() => {
    if (checkStrictly) {
      if (checkedKeysProp && typeof checkedKeysProp === "object" && "checked" in checkedKeysProp) {
        return {
          checkedKeyList: checkedKeysProp.checked,
          halfCheckedKeyList: checkedKeysProp.halfChecked || [],
        };
      }
      const raw = Array.isArray(checkedKeysProp) ? checkedKeysProp : innerCheckedKeys;
      return { checkedKeyList: raw, halfCheckedKeyList: [] };
    }

    const raw = Array.isArray(checkedKeysProp) ? checkedKeysProp : innerCheckedKeys;
    const { checkedKeys: cList, halfCheckedKeys: hList } = recalculateCheckedState(
      raw,
      treeEntities.keyEntities
    );
    return { checkedKeyList: cList, halfCheckedKeyList: hList };
  }, [checkStrictly, checkedKeysProp, innerCheckedKeys, treeEntities]);

  const checkedKeySet = React.useMemo(() => new Set(checkedKeyList), [checkedKeyList]);
  const halfCheckedKeySet = React.useMemo(() => new Set(halfCheckedKeyList), [halfCheckedKeyList]);

  // Async loading state
  const [loadingKeys, setLoadingKeys] = React.useState<Set<Key>>(new Set());
  const [innerLoadedKeys, setInnerLoadedKeys] = React.useState<Set<Key>>(new Set());
  const loadedKeysSet = React.useMemo(() => {
    return loadedKeysProp ? new Set(loadedKeysProp) : innerLoadedKeys;
  }, [loadedKeysProp, innerLoadedKeys]);

  // Drag and drop states
  const [dragOverNodeKey, setDragOverNodeKey] = React.useState<Key | null>(null);
  const [dropPosition, setDropPosition] = React.useState<-1 | 0 | 1>(0);
  const draggingNodeRef = React.useRef<DataNode | null>(null);
  const dragExpandTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flatten tree nodes for rendering
  const flattenNodes = React.useMemo(() => {
    return flattenTree(normalizedData, expandedKeysSet);
  }, [normalizedData, expandedKeysSet]);

  // Handlers
  const handleToggleExpand = React.useCallback(
    async (node: DataNode) => {
      const key = node.key;
      const isExpanded = expandedKeysSet.has(key);
      let nextExpanded: Key[];

      if (isExpanded) {
        nextExpanded = expandedKeys.filter((k) => k !== key);
      } else {
        nextExpanded = [...expandedKeys, key];

        // If node has async loadData and not loaded yet
        if (loadData && !node.children && !loadedKeysSet.has(key) && !loadingKeys.has(key)) {
          setLoadingKeys((prev) => new Set(prev).add(key));
          try {
            await loadData(node);
            setInnerLoadedKeys((prev) => new Set(prev).add(key));
          } finally {
            setLoadingKeys((prev) => {
              const next = new Set(prev);
              next.delete(key);
              return next;
            });
          }
        }
      }

      if (expandedKeysProp === undefined) {
        setInnerExpandedKeys(nextExpanded);
      }
      onExpand?.(nextExpanded, { expanded: !isExpanded, node });
    },
    [expandedKeys, expandedKeysSet, expandedKeysProp, loadData, loadedKeysSet, loadingKeys, onExpand]
  );

  const handleSelect = React.useCallback(
    (node: DataNode, e: React.MouseEvent | React.KeyboardEvent) => {
      if (node.disabled || node.selectable === false) return;
      const key = node.key;
      const isSelected = selectedKeysSet.has(key);
      let nextSelected: Key[];

      if (multiple || (directory && (e.ctrlKey || e.metaKey))) {
        nextSelected = isSelected ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key];
      } else {
        nextSelected = isSelected ? [] : [key];
      }

      if (selectedKeysProp === undefined) {
        setInnerSelectedKeys(nextSelected);
      }

      const entityList = nextSelected.map((k) => treeEntities.keyEntities.get(k)?.node).filter(Boolean) as DataNode[];
      onSelect?.(nextSelected, {
        selected: !isSelected,
        selectedNodes: entityList,
        node,
        event: e,
      });

      if (directory || expandAction === "click") {
        const hasChildren = (node.children && node.children.length > 0) || (loadData && !node.isLeaf);
        if (hasChildren) {
          handleToggleExpand(node);
        }
      }
    },
    [
      multiple,
      directory,
      selectedKeys,
      selectedKeysSet,
      selectedKeysProp,
      treeEntities,
      onSelect,
      expandAction,
      loadData,
      handleToggleExpand,
    ]
  );

  const handleCheck = React.useCallback(
    (node: DataNode, e: React.MouseEvent | React.KeyboardEvent) => {
      if (node.disabled || node.disableCheckbox) return;
      const key = node.key;
      const isChecked = checkedKeySet.has(key);
      const nextChecked = !isChecked;

      if (checkStrictly) {
        let nextCheckedKeys: Key[];
        if (isChecked) {
          nextCheckedKeys = checkedKeyList.filter((k) => k !== key);
        } else {
          nextCheckedKeys = [...checkedKeyList, key];
        }

        const checkedObj = { checked: nextCheckedKeys, halfChecked: halfCheckedKeyList };
        if (checkedKeysProp === undefined) {
          setInnerCheckedKeys(nextCheckedKeys);
        }
        const entityList = nextCheckedKeys.map((k) => treeEntities.keyEntities.get(k)?.node).filter(Boolean) as DataNode[];
        onCheck?.(checkedObj, {
          checked: nextChecked,
          checkedNodes: entityList,
          node,
          event: e,
          halfCheckedKeys: halfCheckedKeyList,
        });
        return;
      }

      // Check with propagation
      const currentCheckedKeys = Array.from(checkedKeySet);
      let targetKeys: Key[];
      if (nextChecked) {
        targetKeys = [...currentCheckedKeys, key];
      } else {
        // remove key and all its descendants
        const toRemove = new Set<Key>([key]);
        const queue = [key];
        while (queue.length > 0) {
          const current = queue.shift()!;
          const ent = treeEntities.keyEntities.get(current);
          if (ent) {
            for (const c of ent.children) {
              toRemove.add(c);
              queue.push(c);
            }
          }
        }
        targetKeys = currentCheckedKeys.filter((k) => !toRemove.has(k));
      }

      const { checkedKeys: resChecked, halfCheckedKeys: resHalf } = recalculateCheckedState(
        targetKeys,
        treeEntities.keyEntities
      );

      if (checkedKeysProp === undefined) {
        setInnerCheckedKeys(resChecked);
      }

      const entityList = resChecked.map((k) => treeEntities.keyEntities.get(k)?.node).filter(Boolean) as DataNode[];
      onCheck?.(resChecked, {
        checked: nextChecked,
        checkedNodes: entityList,
        node,
        event: e,
        halfCheckedKeys: resHalf,
      });
    },
    [
      checkedKeySet,
      checkStrictly,
      checkedKeyList,
      halfCheckedKeyList,
      checkedKeysProp,
      treeEntities,
      onCheck,
    ]
  );

  // Drag handlers
  const handleDragStart = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      draggingNodeRef.current = node;
      try {
        e.dataTransfer.setData("text/plain", String(node.key));
      } catch {
        // ignore
      }
      onDragStart?.({ event: e, node });
    },
    [onDragStart]
  );

  const handleDragOver = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggingNodeRef.current || draggingNodeRef.current.key === node.key) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const offsetY = e.clientY - rect.top;
      const height = rect.height;

      let pos: -1 | 0 | 1 = 0;
      if (offsetY < height * 0.25) {
        pos = -1; // Drop before
      } else if (offsetY > height * 0.75) {
        pos = 1; // Drop after
      } else {
        pos = 0; // Drop inside
      }

      if (allowDrop && !allowDrop({ dragNode: draggingNodeRef.current, dropNode: node, dropPosition: pos })) {
        return;
      }

      setDragOverNodeKey(node.key);
      setDropPosition(pos);

      // Expand on hover
      if (pos === 0 && !expandedKeysSet.has(node.key) && node.children?.length) {
        if (!dragExpandTimerRef.current) {
          dragExpandTimerRef.current = setTimeout(() => {
            handleToggleExpand(node);
            dragExpandTimerRef.current = null;
          }, 800);
        }
      }

      onDragOver?.({ event: e, node });
    },
    [allowDrop, expandedKeysSet, handleToggleExpand, onDragOver]
  );

  const handleDragEnter = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!draggingNodeRef.current || draggingNodeRef.current.key === node.key) return;
      setDragOverNodeKey(node.key);
      onDragEnter?.({ event: e, node, expandedKeys: effectiveExpandedKeys });
    },
    [onDragEnter, effectiveExpandedKeys],
  );

  const handleDragLeave = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (dragExpandTimerRef.current) {
        clearTimeout(dragExpandTimerRef.current);
        dragExpandTimerRef.current = null;
      }
      if (dragOverNodeKey === node.key) {
        setDragOverNodeKey(null);
      }
      onDragLeave?.({ event: e, node });
    },
    [dragOverNodeKey, onDragLeave]
  );

  const handleDrop = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragExpandTimerRef.current) {
        clearTimeout(dragExpandTimerRef.current);
        dragExpandTimerRef.current = null;
      }

      const dragNode = draggingNodeRef.current;
      if (!dragNode || dragNode.key === node.key) {
        setDragOverNodeKey(null);
        return;
      }

      const dropPos = dropPosition;
      setDragOverNodeKey(null);
      draggingNodeRef.current = null;

      onDrop?.({
        event: e,
        node,
        dragNode,
        dragNodesKeys: [dragNode.key],
        dropPosition: dropPos,
        dropToGap: dropPos !== 0,
      });
    },
    [dropPosition, onDrop]
  );

  const handleDragEnd = React.useCallback(
    (node: DataNode, e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (dragExpandTimerRef.current) {
        clearTimeout(dragExpandTimerRef.current);
        dragExpandTimerRef.current = null;
      }
      setDragOverNodeKey(null);
      draggingNodeRef.current = null;
      onDragEnd?.({ event: e, node });
    },
    [onDragEnd]
  );

  // Windowed rendering: with a fixed height only the visible slice is mounted,
  // and spacers stand in for the rest so the scrollbar stays honest.
  const listRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const windowed = Boolean(height) && virtual;
  const overscan = 5;
  const visibleCount = height ? Math.ceil(height / itemHeight) + overscan * 2 : flattenNodes.length;
  const startIndex = windowed ? Math.max(0, Math.floor(scrollTop / itemHeight) - overscan) : 0;
  const endIndex = windowed ? Math.min(flattenNodes.length, startIndex + visibleCount) : flattenNodes.length;
  const visibleNodes = windowed ? flattenNodes.slice(startIndex, endIndex) : flattenNodes;

  const [activeKey, setActiveKey] = React.useState<Key | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (flattenNodes.length === 0) return;
    const index = flattenNodes.findIndex((f) => f.key === activeKey);
    const current = index >= 0 ? flattenNodes[index] : undefined;

    const focusAt = (next: number) => {
      const target = flattenNodes[Math.max(0, Math.min(flattenNodes.length - 1, next))];
      if (!target) return;
      setActiveKey(target.key);
      listRef.current?.querySelector<HTMLElement>(`[data-key="${String(target.key)}"]`)?.scrollIntoView({ block: "nearest" });
    };

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusAt(index === -1 ? 0 : index - 1);
        break;
      case "ArrowRight":
        if (!current) return;
        e.preventDefault();
        if (!expandedKeysSet.has(current.key) && !current.isLeaf) handleToggleExpand(current.node);
        else focusAt(index + 1);
        break;
      case "ArrowLeft": {
        if (!current) return;
        e.preventDefault();
        if (expandedKeysSet.has(current.key)) {
          handleToggleExpand(current.node);
          return;
        }
        const parentKey = treeEntities.keyEntities.get(current.key)?.parent;
        if (parentKey != null) focusAt(flattenNodes.findIndex((f) => f.key === parentKey));
        break;
      }
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(flattenNodes.length - 1);
        break;
      case "Enter":
      case " ":
        if (!current) return;
        e.preventDefault();
        if (checkable && e.key === " ") handleCheck(current.node, e);
        else handleSelect(current.node, e);
        break;
      default:
        break;
    }
  };

  const draggableConfig = typeof draggable === "object" ? draggable : undefined;
  const nodeIsDraggable = (node: DataNode) =>
    Boolean(draggable) && !disabled && !node.disabled && (draggableConfig?.nodeDraggable?.(node) ?? true);
  const dragHandleIcon = draggableConfig?.icon;

  return (
    <div
      ref={listRef}
      data-slot="tree"
      role="tree"
      tabIndex={disabled ? -1 : 0}
      aria-multiselectable={multiple || undefined}
      onKeyDown={handleKeyDown}
      onScroll={windowed ? (e) => setScrollTop((e.target as HTMLDivElement).scrollTop) : undefined}
      className={cn(
        "relative select-none text-sm text-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        disabled && "cursor-not-allowed opacity-50",
        height && "overflow-auto",
        rootClassName,
        className
      )}
      style={{ ...style, maxHeight: height }}
      {...props}
    >
      {windowed && startIndex > 0 && <div aria-hidden style={{ height: startIndex * itemHeight }} />}
      {flattenNodes.length === 0 ? (
        <div className="py-4 text-center text-text-quaternary">No Data</div>
      ) : (
        visibleNodes.map((flat) => {
          const { node, key, level, isLeaf, isLast, parentIsLastList } = flat;
          const isExpanded = expandedKeysSet.has(key);
          const isSelected = selectedKeysSet.has(key);
          const isChecked = checkedKeySet.has(key);
          const isHalfChecked = halfCheckedKeySet.has(key);
          const isLoading = loadingKeys.has(key);
          const hasChildren = (node.children && node.children.length > 0) || (loadData && !isLeaf);
          const isDisabled = disabled || node.disabled;
          const isCheckable = checkable && node.checkable !== false;

          const renderProps: TreeNodeRenderProps = {
            node,
            expanded: isExpanded,
            selected: isSelected,
            checked: isChecked,
            halfChecked: isHalfChecked,
            loading: isLoading,
            isLeaf,
          };

          // Custom switcher icon
          let switcher: React.ReactNode = null;
          if (isLoading) {
            switcher = <Loader2 className="size-3.5 animate-spin text-primary" />;
          } else if (hasChildren) {
            if (typeof node.switcherIcon === "function") {
              switcher = node.switcherIcon(renderProps);
            } else if (node.switcherIcon) {
              switcher = node.switcherIcon;
            } else if (typeof switcherIcon === "function") {
              switcher = switcherIcon(renderProps);
            } else if (switcherIcon) {
              switcher = switcherIcon;
            } else {
              switcher = isExpanded ? (
                <ChevronDown className="size-3.5 transition-transform duration-mid" />
              ) : (
                <ChevronRight className="size-3.5 transition-transform duration-mid" />
              );
            }
          } else if (showLine) {
            // Leaf icon or line
            const leafIconConfig = typeof showLine === "object" ? showLine.showLeafIcon : false;
            if (typeof leafIconConfig === "function") {
              switcher = leafIconConfig(renderProps);
            } else if (leafIconConfig === true) {
              switcher = <File className="size-3.5 text-text-tertiary" />;
            } else if (leafIconConfig) {
              switcher = leafIconConfig;
            } else {
              switcher = null;
            }
          }

          // Node Icon
          let iconNode: React.ReactNode = null;
          if (showIcon || directory || node.icon) {
            if (typeof node.icon === "function") {
              iconNode = node.icon(renderProps);
            } else if (node.icon) {
              iconNode = node.icon;
            } else if (directory) {
              if (hasChildren) {
                iconNode = isExpanded ? (
                  <FolderOpen className="size-4 text-warning" />
                ) : (
                  <Folder className="size-4 text-warning" />
                );
              } else {
                iconNode = <File className="size-4 text-text-tertiary" />;
              }
            }
          }

          // Title render
          let titleContent: React.ReactNode = null;
          if (titleRender) {
            titleContent = titleRender(node);
          } else if (typeof node.title === "function") {
            titleContent = node.title(node);
          } else {
            titleContent = node.title ?? String(node.key);
          }

          // Search filter match
          const isFilterMatched = filterTreeNode ? filterTreeNode(node) : false;

          // DnD classes
          const isDragOver = dragOverNodeKey === key;
          const dropLineBefore = isDragOver && dropPosition === -1;
          const dropLineAfter = isDragOver && dropPosition === 1;
          const dropInside = isDragOver && dropPosition === 0;

          return (
            <div
              key={key}
              data-slot="tree-node"
              data-key={key}
              draggable={nodeIsDraggable(node)}
              onDragStart={(e) => handleDragStart(node, e)}
              onDragEnter={(e) => handleDragEnter(node, e)}
              onDragOver={(e) => handleDragOver(node, e)}
              onDragLeave={(e) => handleDragLeave(node, e)}
              onDrop={(e) => handleDrop(node, e)}
              onDragEnd={(e) => handleDragEnd(node, e)}
              onContextMenu={(e) => {
                if (onRightClick) {
                  e.preventDefault();
                  onRightClick({ event: e, node });
                }
              }}
              onDoubleClick={(e) => {
                onDoubleClick?.({ event: e, node });
                if (expandAction === "doubleClick" && hasChildren) {
                  handleToggleExpand(node);
                }
              }}
              role="treeitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-selected={isSelected}
              aria-level={level + 1}
              data-active={activeKey === key || undefined}
              className={cn(
                "group relative flex items-center py-0.5 leading-6 transition-colors",
                dropInside && "rounded-sm bg-primary-bg ring-1 ring-primary",
                activeKey === key && "ring-1 ring-primary/40 rounded-sm",
                node.className
              )}
              style={{ height: windowed ? itemHeight : undefined, minHeight: windowed ? undefined : 28, ...node.style }}
            >
              {/* Drop indicator lines */}
              {dropLineBefore && (
                <div className="pointer-events-none absolute -top-0.5 right-0 left-0 z-10 h-0.5 bg-primary" />
              )}
              {dropLineAfter && (
                <div className="pointer-events-none absolute -bottom-0.5 right-0 left-0 z-10 h-0.5 bg-primary" />
              )}

              {/* Indentation & connecting lines */}
              {Array.from({ length: level }).map((_, idx) => {
                const isParentLast = parentIsLastList[idx];
                return (
                  <span
                    key={idx}
                    aria-hidden
                    className={cn(
                      "relative inline-block h-full w-6 shrink-0",
                      showLine && !isParentLast && "before:absolute before:top-0 before:bottom-0 before:left-3 before:w-px before:bg-border"
                    )}
                  />
                );
              })}

              {/* Show line connector for current node */}
              {showLine && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute h-full w-6",
                    "before:absolute before:top-0 before:left-3 before:w-px before:bg-border",
                    isLast ? "before:h-3.5" : "before:bottom-0",
                    "after:absolute after:top-3.5 after:left-3 after:h-px after:w-3 after:bg-border"
                  )}
                  style={{ left: `${level * 24}px` }}
                />
              )}

              {/* Drag handle */}
              {nodeIsDraggable(node) && dragHandleIcon !== false && (
                <span
                  aria-hidden
                  className="inline-flex size-4 shrink-0 cursor-grab items-center justify-center text-text-quaternary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  {dragHandleIcon ?? <GripVertical className="size-3.5" />}
                </span>
              )}

              {/* Switcher */}
              <span
                role="button"
                tabIndex={-1}
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren && !isDisabled) {
                    handleToggleExpand(node);
                  }
                }}
                className={cn(
                  "relative z-1 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center text-text-tertiary transition-colors hover:text-text",
                  !hasChildren && !showLine && "pointer-events-none cursor-default opacity-0",
                  isDisabled && "cursor-not-allowed opacity-40 hover:text-text-tertiary"
                )}
              >
                {switcher}
              </span>

              {/* Checkbox */}
              {isCheckable && (
                <span
                  role="checkbox"
                  aria-checked={isChecked ? true : isHalfChecked ? "mixed" : false}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) handleCheck(node, e);
                  }}
                  className={cn(
                    "relative z-1 mr-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border transition-[background-color,border-color]",
                    isChecked
                      ? "border-primary bg-primary text-white"
                      : isHalfChecked
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-bg-container hover:border-primary",
                    (isDisabled || node.disableCheckbox) &&
                      "cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled"
                  )}
                >
                  {isChecked ? (
                    <Check className="size-3 stroke-[3]" />
                  ) : isHalfChecked ? (
                    <Minus className="size-3 stroke-[3]" />
                  ) : null}
                </span>
              )}

              {/* Title & Icon container */}
              <div
                role="treeitem"
                aria-selected={isSelected}
                onClick={(e) => {
                  setActiveKey(key);
                  handleSelect(node, e);
                }}
                className={cn(
                  "relative z-1 flex min-w-0 items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-sm transition-colors",
                  !isDisabled && "cursor-pointer hover:bg-fill-tertiary",
                  isSelected &&
                    (directory
                      ? "bg-primary text-white hover:bg-primary-hover!"
                      : "bg-primary-bg font-medium text-primary hover:bg-primary-bg-hover!"),
                  blockNode && "flex-1",
                  isDisabled && "cursor-not-allowed text-text-disabled hover:bg-transparent"
                )}
              >
                {iconNode && <span className="inline-flex shrink-0 items-center">{iconNode}</span>}
                <span
                  className={cn(
                    "truncate",
                    isFilterMatched && "font-semibold text-error underline decoration-error"
                  )}
                >
                  {titleContent}
                </span>
              </div>
            </div>
          );
        })
      )}
      {windowed && endIndex < flattenNodes.length && (
        <div aria-hidden style={{ height: (flattenNodes.length - endIndex) * itemHeight }} />
      )}
    </div>
  );
}

export interface DirectoryTreeProps extends TreeProps {
  expandAction?: false | "click" | "doubleClick";
}

function TreeDirectoryTree({
  expandAction = "click",
  showIcon = true,
  blockNode = true,
  ...props
}: DirectoryTreeProps) {
  return (
    <Tree
      directory
      showIcon={showIcon}
      blockNode={blockNode}
      expandAction={expandAction}
      {...props}
    />
  );
}

function TreeNode(_props: DataNode) {
  return null;
}

Tree.DirectoryTree = TreeDirectoryTree;
Tree.TreeNode = TreeNode;

export { Tree, TreeDirectoryTree, TreeNode };
