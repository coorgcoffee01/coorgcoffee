export type ProductDepartment = 'coffee' | 'chocolate' | 'wine';

export interface ProductLike {
  categoryId?: string | undefined;
  categoryName?: string | undefined;
  sku?: string | undefined;
  productId?: string | undefined;
  id?: string | undefined;
  productName?: string | undefined;
  name?: string | undefined;
  roastLevel?: string | undefined;
}

export function getProductDepartment(input: ProductLike): ProductDepartment {
  const catId = (input.categoryId || '').toLowerCase();
  const catName = (input.categoryName || '').toLowerCase();
  const sku = (input.sku || '').toUpperCase();
  const pid = (input.productId || input.id || '').toLowerCase();
  const name = (input.productName || input.name || '').toLowerCase();
  const roast = (input.roastLevel || '').toLowerCase();

  if (
    catId === 'cat-wines' ||
    catName.includes('wine') ||
    sku.startsWith('CC-WINE') ||
    pid.includes('wine') ||
    name.includes('wine') ||
    roast.includes('wine')
  ) {
    return 'wine';
  }

  if (
    catId === 'cat-chocolates' ||
    catName.includes('chocolate') ||
    sku.startsWith('CC-CHOC') ||
    pid.includes('choco') ||
    pid.includes('crispy-balls') ||
    name.includes('chocolate') ||
    name.includes('crispy balls') ||
    roast.includes('chocolate')
  ) {
    return 'chocolate';
  }

  return 'coffee';
}

export function isGlassBottleItem(input: {
  variantLabel?: string | undefined;
  sku?: string | undefined;
}): boolean {
  const label = (input.variantLabel || '').toLowerCase();
  const sku = (input.sku || '').toUpperCase();
  return label.includes('glass') || sku.includes('-GLAS-');
}

export function getDepartmentLabel(dept: ProductDepartment): string {
  if (dept === 'wine') return 'Homemade Wine';
  if (dept === 'chocolate') return 'Chocolate';
  return 'Coffee';
}

export function getDepartmentBadgeClasses(dept: ProductDepartment): string {
  if (dept === 'wine') {
    return 'bg-rose-500/15 text-rose-300 border-rose-500/35';
  }
  if (dept === 'chocolate') {
    return 'bg-amber-600/15 text-amber-300 border-amber-500/35';
  }
  return 'bg-[#C89B3C]/15 text-[#C89B3C] border-[#C89B3C]/35';
}

export function getItemUnitWord(dept: ProductDepartment, qty: number): string {
  if (dept === 'wine') return qty === 1 ? 'Bottle' : 'Bottles';
  if (dept === 'chocolate') return qty === 1 ? 'Tub' : 'Tubs';
  return qty === 1 ? 'Pouch' : 'Pouches';
}

export interface OrderItemSpec {
  department: ProductDepartment;
  primaryTag: string;
  secondaryTag?: string | undefined;
  packingNote?: string | undefined;
  isFragileGlass: boolean;
  unitWord: string;
}

export function getOrderItemSpec(item: {
  productId?: string | undefined;
  productName?: string | undefined;
  variantLabel?: string | undefined;
  sku?: string | undefined;
  grindOption?: string | undefined;
  roastLevel?: string | undefined;
  quantity?: number | undefined;
}): OrderItemSpec {
  const department = getProductDepartment(item);
  const qty = item.quantity ?? 1;
  const unitWord = getItemUnitWord(department, qty);

  if (department === 'wine') {
    const isFragileGlass = isGlassBottleItem(item);
    return {
      department,
      primaryTag: item.variantLabel || '750ml Bottle',
      secondaryTag: isFragileGlass ? 'Fragile Glass — Bubble Wrap' : 'Food-Grade Plastic — Sealed',
      packingNote: isFragileGlass ? 'FRAGILE GLASS' : 'Leak-Proof Seal',
      isFragileGlass,
      unitWord,
    };
  }

  if (department === 'chocolate') {
    return {
      department,
      primaryTag: `Artisanal Chocolate • ${item.variantLabel || 'Sealed Tub'}`,
      secondaryTag: 'Cool & Dry Pack',
      packingNote: 'Cool & Dry Pack',
      isFragileGlass: false,
      unitWord,
    };
  }

  const grindPreference =
    item.grindOption ||
    ((item.productName || '').toLowerCase().includes('bean')
      ? 'Whole Beans'
      : 'South Indian Filter Grind');

  return {
    department: 'coffee',
    primaryTag: `Grind: ${grindPreference}`,
    secondaryTag: item.roastLevel ? `Roast: ${item.roastLevel}` : undefined,
    isFragileGlass: false,
    unitWord,
  };
}

export function getOrderDepartments(
  items: Array<{
    productId?: string | undefined;
    productName?: string | undefined;
    variantLabel?: string | undefined;
    sku?: string | undefined;
    roastLevel?: string | undefined;
  }> = []
): {
  departments: ProductDepartment[];
  hasGlassBottle: boolean;
} {
  const set = new Set<ProductDepartment>();
  let hasGlassBottle = false;

  for (const item of items) {
    const dept = getProductDepartment(item);
    set.add(dept);
    if (dept === 'wine' && isGlassBottleItem(item)) {
      hasGlassBottle = true;
    }
  }

  const ordered: ProductDepartment[] = [];
  if (set.has('coffee')) ordered.push('coffee');
  if (set.has('chocolate')) ordered.push('chocolate');
  if (set.has('wine')) ordered.push('wine');

  return { departments: ordered, hasGlassBottle };
}
