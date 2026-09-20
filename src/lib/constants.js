export const ITEM_STATUSES = [
  "NEW",
  "IN_USE",
  "NO_LONGER_IN_USE",
  "SOLD",
  "OUT_OF_STOCK",
];

export const ITEM_STATUS_LABELS = {
  NEW: "New",
  IN_USE: "In Use",
  NO_LONGER_IN_USE: "No Longer In Use",
  SOLD: "Sold",
  OUT_OF_STOCK: "Out of Stock",
};

export const ITEM_TYPES = ["ELECTRONICS", "FURNITURE", "APPLIANCE", "OTHER"];

export const ITEM_TYPE_LABELS = {
  ELECTRONICS: "Electronics",
  FURNITURE: "Furniture",
  APPLIANCE: "Appliance",
  OTHER: "Other",
};

export const TENDER_TYPES = ["REPAIR_TENDER", "SELLING_TENDER"];

export const TENDER_TYPE_LABELS = {
  REPAIR_TENDER: "Repair Tender",
  SELLING_TENDER: "Selling Tender",
};

export const TENDER_STATUSES = ["NOT_PUBLISHED", "PUBLISHED", "OVER"];

export const TENDER_STATUS_LABELS = {
  NOT_PUBLISHED: "Not Published",
  PUBLISHED: "Published",
  OVER: "Concluded",
};

export const PERMISSIONS = [
  "MANAGE_ITEMS",
  "MANAGE_WAREHOUSES",
  "MANAGE_COMPANIES",
  "MANAGE_TENDERS",
];

export const PERMISSION_LABELS = {
  MANAGE_ITEMS: "Items",
  MANAGE_WAREHOUSES: "Warehouses",
  MANAGE_COMPANIES: "Companies",
  MANAGE_TENDERS: "Disposal Requests",
};

export const PERMISSION_DESCRIPTIONS = {
  MANAGE_ITEMS: "View and manage assets",
  MANAGE_WAREHOUSES: "View and manage storage locations",
  MANAGE_COMPANIES: "View and manage repair/buyer companies",
  MANAGE_TENDERS: "View and manage disposal requests",
};

export function statusToClassName(status) {
  return status ? status.toLowerCase().replace(/_/g, "-") : "";
}
