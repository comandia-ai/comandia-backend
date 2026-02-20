-- COMANDIA - Mango Biche Product Catalog
-- Tenant: COMANDIA (ada3b48e-ddf4-4984-b039-e99caa19cfa3)

-- ============================================
-- 1. PRODUCT CATEGORIES
-- ============================================
INSERT INTO product_categories (tenant_id, name, description, sort_order) VALUES
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', 'Granizados Dulces', 'Granizados de sabores dulces', 1),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', 'Granizados Ácidos', 'Granizados de sabores ácidos', 2),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', 'Especiales', 'Granizados especiales y premium', 3),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', 'Adicionales', 'Toppings y extras', 4);

-- ============================================
-- 2. GRANIZADOS DULCES
-- ============================================
INSERT INTO products (tenant_id, category_id, sku, name, unit, price, is_active, tags, metadata) VALUES
-- Limonada Cerezada
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-LIM-CER-12', 'Limonada Cerezada 12oz', '12oz', 7500, true, ARRAY['dulce','limonada','cereza'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-LIM-CER-14', 'Limonada Cerezada 14oz', '14oz', 8500, true, ARRAY['dulce','limonada','cereza'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-LIM-CER-16', 'Limonada Cerezada 16oz', '16oz', 10500, true, ARRAY['dulce','limonada','cereza'], '{"size_oz": 16}'),

-- Granizado de Mora Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MOR-COC-12', 'Granizado de Mora Coco 12oz', '12oz', 7500, true, ARRAY['dulce','mora','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MOR-COC-14', 'Granizado de Mora Coco 14oz', '14oz', 8500, true, ARRAY['dulce','mora','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MOR-COC-16', 'Granizado de Mora Coco 16oz', '16oz', 10500, true, ARRAY['dulce','mora','coco'], '{"size_oz": 16}'),

-- Granizado de Mandarina
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-12', 'Granizado de Mandarina 12oz', '12oz', 7500, true, ARRAY['dulce','mandarina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-14', 'Granizado de Mandarina 14oz', '14oz', 8500, true, ARRAY['dulce','mandarina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-16', 'Granizado de Mandarina 16oz', '16oz', 10500, true, ARRAY['dulce','mandarina'], '{"size_oz": 16}'),

-- Granizado de Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCO-12', 'Granizado de Coco 12oz', '12oz', 7500, true, ARRAY['dulce','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCO-14', 'Granizado de Coco 14oz', '14oz', 8500, true, ARRAY['dulce','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCO-16', 'Granizado de Coco 16oz', '16oz', 10500, true, ARRAY['dulce','coco'], '{"size_oz": 16}'),

-- Coco Cereza
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COC-CER-12', 'Coco Cereza 12oz', '12oz', 7500, true, ARRAY['dulce','coco','cereza'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COC-CER-14', 'Coco Cereza 14oz', '14oz', 8500, true, ARRAY['dulce','coco','cereza'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COC-CER-16', 'Coco Cereza 16oz', '16oz', 10500, true, ARRAY['dulce','coco','cereza'], '{"size_oz": 16}'),

-- Granizado de Café
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAFE-12', 'Granizado de Café 12oz', '12oz', 7500, true, ARRAY['dulce','cafe'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAFE-14', 'Granizado de Café 14oz', '14oz', 8500, true, ARRAY['dulce','cafe'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAFE-16', 'Granizado de Café 16oz', '16oz', 10500, true, ARRAY['dulce','cafe'], '{"size_oz": 16}'),

-- Granizado de Guanabana Cereza
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-CER-12', 'Granizado de Guanabana Cereza 12oz', '12oz', 7500, true, ARRAY['dulce','guanabana','cereza'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-CER-14', 'Granizado de Guanabana Cereza 14oz', '14oz', 8500, true, ARRAY['dulce','guanabana','cereza'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-CER-16', 'Granizado de Guanabana Cereza 16oz', '16oz', 10500, true, ARRAY['dulce','guanabana','cereza'], '{"size_oz": 16}'),

-- Guanabana en Leche
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-LEC-12', 'Guanabana en Leche 12oz', '12oz', 7500, true, ARRAY['dulce','guanabana','leche'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-LEC-14', 'Guanabana en Leche 14oz', '14oz', 8500, true, ARRAY['dulce','guanabana','leche'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-GUA-LEC-16', 'Guanabana en Leche 16oz', '16oz', 10500, true, ARRAY['dulce','guanabana','leche'], '{"size_oz": 16}'),

-- Granizado de Piña
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-PINA-12', 'Granizado de Piña 12oz', '12oz', 7500, true, ARRAY['dulce','pina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-PINA-14', 'Granizado de Piña 14oz', '14oz', 8500, true, ARRAY['dulce','pina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-PINA-16', 'Granizado de Piña 16oz', '16oz', 10500, true, ARRAY['dulce','pina'], '{"size_oz": 16}'),

-- Cocopiña
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCPIN-12', 'Cocopiña 12oz', '12oz', 7500, true, ARRAY['dulce','coco','pina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCPIN-14', 'Cocopiña 14oz', '14oz', 8500, true, ARRAY['dulce','coco','pina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-COCPIN-16', 'Cocopiña 16oz', '16oz', 10500, true, ARRAY['dulce','coco','pina'], '{"size_oz": 16}'),

-- Salpicón
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-SALP-12', 'Salpicón 12oz', '12oz', 7500, true, ARRAY['dulce','salpicon'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-SALP-14', 'Salpicón 14oz', '14oz', 8500, true, ARRAY['dulce','salpicon'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-SALP-16', 'Salpicón 16oz', '16oz', 10500, true, ARRAY['dulce','salpicon'], '{"size_oz": 16}'),

-- Granizado de Banano
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-BAN-12', 'Granizado de Banano 12oz', '12oz', 7500, true, ARRAY['dulce','banano'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-BAN-14', 'Granizado de Banano 14oz', '14oz', 8500, true, ARRAY['dulce','banano'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-BAN-16', 'Granizado de Banano 16oz', '16oz', 10500, true, ARRAY['dulce','banano'], '{"size_oz": 16}'),

-- Frutos Rojos
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRUT-ROJ-12', 'Frutos Rojos 12oz', '12oz', 7500, true, ARRAY['dulce','frutos rojos'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRUT-ROJ-14', 'Frutos Rojos 14oz', '14oz', 8500, true, ARRAY['dulce','frutos rojos'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRUT-ROJ-16', 'Frutos Rojos 16oz', '16oz', 10500, true, ARRAY['dulce','frutos rojos'], '{"size_oz": 16}'),

-- Café con Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAF-COC-12', 'Café con Coco 12oz', '12oz', 7500, true, ARRAY['dulce','cafe','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAF-COC-14', 'Café con Coco 14oz', '14oz', 8500, true, ARRAY['dulce','cafe','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-CAF-COC-16', 'Café con Coco 16oz', '16oz', 10500, true, ARRAY['dulce','cafe','coco'], '{"size_oz": 16}'),

-- Granizado de Mandarina con Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-COC-12', 'Granizado de Mandarina con Coco 12oz', '12oz', 7500, true, ARRAY['dulce','mandarina','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-COC-14', 'Granizado de Mandarina con Coco 14oz', '14oz', 8500, true, ARRAY['dulce','mandarina','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-MAND-COC-16', 'Granizado de Mandarina con Coco 16oz', '16oz', 10500, true, ARRAY['dulce','mandarina','coco'], '{"size_oz": 16}'),

-- Granizado de Naranja Piña
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-NAR-PIN-12', 'Granizado de Naranja Piña 12oz', '12oz', 7500, true, ARRAY['dulce','naranja','pina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-NAR-PIN-14', 'Granizado de Naranja Piña 14oz', '14oz', 8500, true, ARRAY['dulce','naranja','pina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-NAR-PIN-16', 'Granizado de Naranja Piña 16oz', '16oz', 10500, true, ARRAY['dulce','naranja','pina'], '{"size_oz": 16}'),

-- Granizado de Fresa Piña
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRE-PIN-12', 'Granizado de Fresa Piña 12oz', '12oz', 7500, true, ARRAY['dulce','fresa','pina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRE-PIN-14', 'Granizado de Fresa Piña 14oz', '14oz', 8500, true, ARRAY['dulce','fresa','pina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Dulces' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GD-FRE-PIN-16', 'Granizado de Fresa Piña 16oz', '16oz', 10500, true, ARRAY['dulce','fresa','pina'], '{"size_oz": 16}');

-- ============================================
-- 3. GRANIZADOS ACIDOS
-- ============================================
INSERT INTO products (tenant_id, category_id, sku, name, unit, price, is_active, tags, metadata) VALUES
-- Granizado de Limón
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LIM-12', 'Granizado de Limón 12oz', '12oz', 7500, true, ARRAY['acido','limon'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LIM-14', 'Granizado de Limón 14oz', '14oz', 8500, true, ARRAY['acido','limon'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LIM-16', 'Granizado de Limón 16oz', '16oz', 10500, true, ARRAY['acido','limon'], '{"size_oz": 16}'),

-- Lulada
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LUL-12', 'Lulada 12oz', '12oz', 7500, true, ARRAY['acido','lulo'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LUL-14', 'Lulada 14oz', '14oz', 8500, true, ARRAY['acido','lulo'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-LUL-16', 'Lulada 16oz', '16oz', 10500, true, ARRAY['acido','lulo'], '{"size_oz": 16}'),

-- Granizado de Maracuyá con Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-COC-12', 'Granizado de Maracuyá con Coco 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-COC-14', 'Granizado de Maracuyá con Coco 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-COC-16', 'Granizado de Maracuyá con Coco 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','coco'], '{"size_oz": 16}'),

-- Granizado de Mango Biche
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-BIC-12', 'Granizado de Mango Biche 12oz', '12oz', 7500, true, ARRAY['acido','mango','biche'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-BIC-14', 'Granizado de Mango Biche 14oz', '14oz', 8500, true, ARRAY['acido','mango','biche'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-BIC-16', 'Granizado de Mango Biche 16oz', '16oz', 10500, true, ARRAY['acido','mango','biche'], '{"size_oz": 16}'),

-- Maracolulo
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MARCOL-12', 'Maracolulo 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','lulo'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MARCOL-14', 'Maracolulo 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','lulo'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MARCOL-16', 'Maracolulo 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','lulo'], '{"size_oz": 16}'),

-- Granizado de Yerbabuena
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-YERB-12', 'Granizado de Yerbabuena 12oz', '12oz', 7500, true, ARRAY['acido','yerbabuena'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-YERB-14', 'Granizado de Yerbabuena 14oz', '14oz', 8500, true, ARRAY['acido','yerbabuena'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-YERB-16', 'Granizado de Yerbabuena 16oz', '16oz', 10500, true, ARRAY['acido','yerbabuena'], '{"size_oz": 16}'),

-- Maracuyá Tropical
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-TRO-12', 'Maracuyá Tropical 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','tropical'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-TRO-14', 'Maracuyá Tropical 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','tropical'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-TRO-16', 'Maracuyá Tropical 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','tropical'], '{"size_oz": 16}'),

-- Maracufresa
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-FRE-12', 'Maracufresa 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','fresa'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-FRE-14', 'Maracufresa 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','fresa'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-FRE-16', 'Maracufresa 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','fresa'], '{"size_oz": 16}'),

-- Granizado de Maracuyá
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-12', 'Granizado de Maracuyá 12oz', '12oz', 7500, true, ARRAY['acido','maracuya'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-14', 'Granizado de Maracuyá 14oz', '14oz', 8500, true, ARRAY['acido','maracuya'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-16', 'Granizado de Maracuyá 16oz', '16oz', 10500, true, ARRAY['acido','maracuya'], '{"size_oz": 16}'),

-- Mango Coco
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-COC-12', 'Mango Coco 12oz', '12oz', 7500, true, ARRAY['acido','mango','coco'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-COC-14', 'Mango Coco 14oz', '14oz', 8500, true, ARRAY['acido','mango','coco'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAN-COC-16', 'Mango Coco 16oz', '16oz', 10500, true, ARRAY['acido','mango','coco'], '{"size_oz": 16}'),

-- Granizado de Fresa
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-FRESA-12', 'Granizado de Fresa 12oz', '12oz', 7500, true, ARRAY['acido','fresa'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-FRESA-14', 'Granizado de Fresa 14oz', '14oz', 8500, true, ARRAY['acido','fresa'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-FRESA-16', 'Granizado de Fresa 16oz', '16oz', 10500, true, ARRAY['acido','fresa'], '{"size_oz": 16}'),

-- Maracumango
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-MAN-12', 'Maracumango 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','mango'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-MAN-14', 'Maracumango 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','mango'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-MAN-16', 'Maracumango 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','mango'], '{"size_oz": 16}'),

-- Granizado de Mora Fresa
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MOR-FRE-12', 'Granizado de Mora Fresa 12oz', '12oz', 7500, true, ARRAY['acido','mora','fresa'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MOR-FRE-14', 'Granizado de Mora Fresa 14oz', '14oz', 8500, true, ARRAY['acido','mora','fresa'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MOR-FRE-16', 'Granizado de Mora Fresa 16oz', '16oz', 10500, true, ARRAY['acido','mora','fresa'], '{"size_oz": 16}'),

-- Mandarina con Limón
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAND-LIM-12', 'Mandarina con Limón 12oz', '12oz', 7500, true, ARRAY['acido','mandarina','limon'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAND-LIM-14', 'Mandarina con Limón 14oz', '14oz', 8500, true, ARRAY['acido','mandarina','limon'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAND-LIM-16', 'Mandarina con Limón 16oz', '16oz', 10500, true, ARRAY['acido','mandarina','limon'], '{"size_oz": 16}'),

-- Maracupiña
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-PIN-12', 'Maracupiña 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','pina'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-PIN-14', 'Maracupiña 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','pina'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-PIN-16', 'Maracupiña 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','pina'], '{"size_oz": 16}'),

-- Maracubanano
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-BAN-12', 'Maracubanano 12oz', '12oz', 7500, true, ARRAY['acido','maracuya','banano'], '{"size_oz": 12}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-BAN-14', 'Maracubanano 14oz', '14oz', 8500, true, ARRAY['acido','maracuya','banano'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Granizados Ácidos' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'GA-MAR-BAN-16', 'Maracubanano 16oz', '16oz', 10500, true, ARRAY['acido','maracuya','banano'], '{"size_oz": 16}');

-- ============================================
-- 4. ESPECIALES
-- ============================================
INSERT INTO products (tenant_id, category_id, sku, name, unit, price, is_active, tags, metadata) VALUES
-- Fruticereal
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-FRUC-14', 'Fruticereal 14oz', '14oz', 11500, true, ARRAY['especial','fruticereal'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-FRUC-16', 'Fruticereal 16oz', '16oz', 15000, true, ARRAY['especial','fruticereal'], '{"size_oz": 16}'),

-- Granizado de Milo
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-MILO-14', 'Granizado de Milo 14oz', '14oz', 11500, true, ARRAY['especial','milo'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-MILO-16', 'Granizado de Milo 16oz', '16oz', 15000, true, ARRAY['especial','milo'], '{"size_oz": 16}'),

-- Granizado Fiesta
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-FIES-16', 'Granizado Fiesta 16oz', '16oz', 15000, true, ARRAY['especial','fiesta'], '{"size_oz": 16}'),

-- Cholao Valluna
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-CHOL-14', 'Cholao Valluna 14oz', '14oz', 11500, true, ARRAY['especial','cholao'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-CHOL-16', 'Cholao Valluna 16oz', '16oz', 14000, true, ARRAY['especial','cholao'], '{"size_oz": 16}'),

-- Granizado de Oreo
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-OREO-14', 'Granizado de Oreo 14oz', '14oz', 11500, true, ARRAY['especial','oreo'], '{"size_oz": 14}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-OREO-16', 'Granizado de Oreo 16oz', '16oz', 14000, true, ARRAY['especial','oreo'], '{"size_oz": 16}'),

-- Mojito (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-MOJI-16', 'Mojito 16oz', '16oz', 16500, true, ARRAY['especial','mojito','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}'),

-- Cerveza con Maracuyá (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-CERV-MAR-16', 'Cerveza con Maracuyá 16oz', '16oz', 15000, true, ARRAY['especial','cerveza','maracuya','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}'),

-- Mango Biche con Cerveza (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-MAN-CERV-16', 'Mango Biche con Cerveza 16oz', '16oz', 15000, true, ARRAY['especial','mango','cerveza','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}'),

-- Granizado de Cerveza (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-CERV-16', 'Granizado de Cerveza 16oz', '16oz', 15000, true, ARRAY['especial','cerveza','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}'),

-- Granizado de Café con Ron (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-CAF-RON-16', 'Granizado de Café con Ron 16oz', '16oz', 16500, true, ARRAY['especial','cafe','ron','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}'),

-- Mango Biche con Ron (18+)
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Especiales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'ES-MAN-RON-16', 'Mango Biche con Ron 16oz', '16oz', 16500, true, ARRAY['especial','mango','ron','18+','alcohol'], '{"size_oz": 16, "age_restricted": true}');

-- ============================================
-- 5. ADICIONALES
-- ============================================
INSERT INTO products (tenant_id, category_id, sku, name, unit, price, is_active, tags, metadata) VALUES
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Adicionales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'AD-LECH', 'Adicional de Lechera', 'unidad', 5000, true, ARRAY['adicional','lechera'], '{"type": "topping"}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Adicionales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'AD-RON', 'Shot de Ron', 'unidad', 9000, true, ARRAY['adicional','ron','18+','alcohol'], '{"type": "topping", "age_restricted": true}'),
('ada3b48e-ddf4-4984-b039-e99caa19cfa3', (SELECT id FROM product_categories WHERE name='Adicionales' AND tenant_id='ada3b48e-ddf4-4984-b039-e99caa19cfa3'), 'AD-MILO', 'Adicional de Milo', 'unidad', 5000, true, ARRAY['adicional','milo'], '{"type": "topping"}');
