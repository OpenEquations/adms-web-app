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

export function statusToClassName(status) {
  return status ? status.toLowerCase().replace(/_/g, "-") : "";
}
