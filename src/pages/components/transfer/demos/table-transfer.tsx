import * as React from "react";
import { Transfer, type TransferItem } from "@/components/ui/transfer";
import { Checkbox } from "@/components/ui/checkbox";

interface TableRecordType extends TransferItem {
  key: string;
  title: string;
  description: string;
  tag: string;
}

const mockData: TableRecordType[] = Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  title: `User_${i + 1}`,
  description: `Dept ${String.fromCharCode(65 + (i % 4))}`,
  tag: i % 2 === 0 ? "Active" : "Pending",
}));

export default function Demo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(["1", "4"]);

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      listStyle={{ width: 280, height: 260 }}
      onChange={(keys) => setTargetKeys(keys)}
    >
      {({ filteredItems, selectedKeys, onItemSelect }) => {
        return (
          <div className="h-full overflow-y-auto kk-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-fill-alter border-b border-border-secondary text-text-secondary font-medium">
                <tr>
                  <th className="p-2 w-8" />
                  <th className="p-2">Name</th>
                  <th className="p-2">Dept</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isChecked = selectedKeys.includes(item.key);
                  const record = item as TableRecordType;
                  return (
                    <tr
                      key={item.key}
                      onClick={() => onItemSelect(item.key, !isChecked)}
                      className="cursor-pointer border-b border-border-secondary hover:bg-fill-tertiary transition-colors"
                    >
                      <td className="p-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => onItemSelect(item.key, e.target.checked)}
                        />
                      </td>
                      <td className="p-2 font-medium text-text">{record.title}</td>
                      <td className="p-2 text-text-secondary">{record.description}</td>
                      <td className="p-2">
                        <span
                          className={
                            record.tag === "Active"
                              ? "text-success font-medium"
                              : "text-warning font-medium"
                          }
                        >
                          {record.tag}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }}
    </Transfer>
  );
}
