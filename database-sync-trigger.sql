-- ================================================================
-- CROSS-DATABASE PRODUCT SYNC TRIGGER SOLUTION
-- ================================================================
-- This script creates triggers to automatically sync product_name
-- and all price fields from cart.product
-- to sirichaielectricdb.product when changes occur.
--
-- Author: Database Sync System
-- Date: 2025-10-12
-- ================================================================

-- Ensure we're in the source database
USE `cart`;

-- ================================================================
-- TRIGGER 1: Sync on UPDATE
-- ================================================================
-- This trigger fires AFTER any UPDATE on cart.product
-- and updates the corresponding record in sirichaielectricdb.product

DELIMITER $$

DROP TRIGGER IF EXISTS `sync_product_to_sirichaielectric_after_update`$$

CREATE TRIGGER `sync_product_to_sirichaielectric_after_update`
AFTER UPDATE ON `cart`.`product`
FOR EACH ROW
BEGIN
    -- Update the target database with new product_name and all prices
    UPDATE `sirichaielectricdb`.`product`
    SET
        `product_name` = NEW.`product_name`,
        `standard_price` = NEW.`standard_price`,
        `capital_price` = NEW.`capital_price`,
        `ss_price` = NEW.`ss_price`,
        `s_price` = NEW.`s_price`,
        `a_price` = NEW.`a_price`,
        `b_price` = NEW.`b_price`,
        `c_price` = NEW.`c_price`,
        `vb_price` = NEW.`vb_price`,
        `vc_price` = NEW.`vc_price`,
        `d_price` = NEW.`d_price`,
        `e_price` = NEW.`e_price`,
        `f_price` = NEW.`f_price`
    WHERE
        `product_id` = NEW.`product_id`;

    -- Log the sync operation (optional - requires a log table)
    -- INSERT INTO `sirichaielectricdb`.`product_sync_log`
    -- (`product_id`, `sync_time`, `sync_type`, `old_product_name`, `new_product_name`)
    -- VALUES (NEW.`product_id`, NOW(), 'UPDATE', OLD.`product_name`, NEW.`product_name`);
END$$

DELIMITER ;

-- ================================================================
-- TRIGGER 2: Sync on INSERT
-- ================================================================
-- This trigger fires AFTER any INSERT on cart.product
-- and creates the corresponding record in sirichaielectricdb.product

DELIMITER $$

DROP TRIGGER IF EXISTS `sync_product_to_sirichaielectric_after_insert`$$

CREATE TRIGGER `sync_product_to_sirichaielectric_after_insert`
AFTER INSERT ON `cart`.`product`
FOR EACH ROW
BEGIN
    -- Insert into target database if the product doesn't already exist
    INSERT INTO `sirichaielectricdb`.`product` (
        `product_id`,
        `product_name`,
        `product_name2`,
        `product_search`,
        `unit_name`,
        `standard_price`,
        `capital_price`,
        `ss_price`,
        `s_price`,
        `a_price`,
        `b_price`,
        `c_price`,
        `vb_price`,
        `vc_price`,
        `d_price`,
        `e_price`,
        `f_price`,
        `brand`,
        `upgrade_condition`,
        `product_opt_namemain`
    ) VALUES (
        NEW.`product_id`,
        NEW.`product_name`,
        NEW.`product_name2`,
        NEW.`product_search`,
        NEW.`unit_name`,
        NEW.`standard_price`,
        NEW.`capital_price`,
        NEW.`ss_price`,
        NEW.`s_price`,
        NEW.`a_price`,
        NEW.`b_price`,
        NEW.`c_price`,
        NEW.`vb_price`,
        NEW.`vc_price`,
        NEW.`d_price`,
        NEW.`e_price`,
        NEW.`f_price`,
        NEW.`brand`,
        NEW.`upgrade_condition`,
        NEW.`product_opt_namemain`
    )
    ON DUPLICATE KEY UPDATE
        `product_name` = NEW.`product_name`,
        `standard_price` = NEW.`standard_price`,
        `capital_price` = NEW.`capital_price`,
        `ss_price` = NEW.`ss_price`,
        `s_price` = NEW.`s_price`,
        `a_price` = NEW.`a_price`,
        `b_price` = NEW.`b_price`,
        `c_price` = NEW.`c_price`,
        `vb_price` = NEW.`vb_price`,
        `vc_price` = NEW.`vc_price`,
        `d_price` = NEW.`d_price`,
        `e_price` = NEW.`e_price`,
        `f_price` = NEW.`f_price`;
END$$

DELIMITER ;