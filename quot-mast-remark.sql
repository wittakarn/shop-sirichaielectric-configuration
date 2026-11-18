-- Fast quotation (AI) stores the customer's contact note (Line ID, phone, ...) here.
ALTER TABLE quot_mast ADD COLUMN remark VARCHAR(500) NULL COMMENT 'หมายเหตุ / contact note';
