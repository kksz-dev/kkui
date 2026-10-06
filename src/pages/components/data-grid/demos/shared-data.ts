export interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  city: string;
  salary: number;
  status: "active" | "inactive" | "pending";
}

const ROLES = ["Engineer", "Designer", "Analyst", "Manager", "Support"];
const DEPARTMENTS = ["Engineering", "Design", "Finance", "Operations"];
const CITIES = ["Bangkok", "Chiang Mai", "Phuket", "Khon Kaen"];
const STATUSES: EmployeeRecord["status"][] = ["active", "inactive", "pending"];

/** Deterministic sample rows, so the docs render the same numbers every time. */
export function makeEmployees(count: number): EmployeeRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `emp-${i + 1}`,
    name: `Employee ${String(i + 1).padStart(3, "0")}`,
    role: ROLES[i % ROLES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    city: CITIES[(i * 3) % CITIES.length],
    salary: 28000 + ((i * 3700) % 62000),
    status: STATUSES[i % STATUSES.length],
  }));
}
