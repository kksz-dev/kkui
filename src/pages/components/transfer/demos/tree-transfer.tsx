import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";
import { Tree, type DataNode } from "@/components/ui/tree";

const treeData: DataNode[] = [
  { key: "0-0", title: "Node 0-0" },
  {
    key: "0-1",
    title: "Node 0-1",
    children: [
      { key: "0-1-0", title: "Node 0-1-0" },
      { key: "0-1-1", title: "Node 0-1-1" },
    ],
  },
  {
    key: "0-2",
    title: "Node 0-2",
    children: [
      { key: "0-2-0", title: "Node 0-2-0" },
      { key: "0-2-1", title: "Node 0-2-1" },
    ],
  },
];

const transferDataSource: TransferItem[] = [];
function flatten(list: DataNode[] = []) {
  list.forEach((item) => {
    transferDataSource.push({ key: String(item.key), title: String(item.title) });
    if (item.children) {
      flatten(item.children);
    }
  });
}
flatten(treeData);

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);

  return (
    <Transfer
      dataSource={transferDataSource}
      targetKeys={targetKeys}
      listStyle={{ width: 260, height: 260 }}
      onChange={(keys) => setTargetKeys(keys)}
      render={(item) => item.title ?? item.key}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div className="h-full overflow-y-auto kk-scrollbar p-2">
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={treeData}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(String(key), !selectedKeys.includes(String(key)));
                }}
              />
            </div>
          );
        }
        return null;
      }}
    </Transfer>
  );
}
