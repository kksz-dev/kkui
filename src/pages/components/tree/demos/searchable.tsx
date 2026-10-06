import * as React from "react";
import { Tree, type DataNode, type Key } from "@/components/ui/tree";
import { Input } from "@/components/ui/input";

const defaultData: DataNode[] = [
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
    ],
  },
  {
    title: "0-1",
    key: "0-1",
    children: [
      { title: "0-1-0-0", key: "0-1-0-0" },
      { title: "0-1-0-1", key: "0-1-0-1" },
    ],
  },
];

const getParentKey = (key: Key, tree: DataNode[]): Key | undefined => {
  let parentKey: Key | undefined;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default function Demo() {
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newExpandedKeys: Key[] = [];

    const findMatches = (data: DataNode[]) => {
      data.forEach((item) => {
        const title = String(item.title);
        if (value && title.includes(value)) {
          const parent = getParentKey(item.key, defaultData);
          if (parent && !newExpandedKeys.includes(parent)) {
            newExpandedKeys.push(parent);
          }
        }
        if (item.children) {
          findMatches(item.children);
        }
      });
    };

    findMatches(defaultData);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return (
    <div className="space-y-4">
      <Input.Search
        placeholder="Search tree nodes"
        value={searchValue}
        onChange={onSearchChange}
      />
      <Tree
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={(keys) => {
          setExpandedKeys(keys);
          setAutoExpandParent(false);
        }}
        filterTreeNode={(node) => !!searchValue && String(node.title).includes(searchValue)}
        treeData={defaultData}
      />
    </div>
  );
}
