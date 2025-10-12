<?php
ini_set('display_errors', 1); 
error_reporting(E_ALL);
session_start();
require_once("config.php");
require_once(DOCUMENT_ROOT.'server/utils/Permission.php');

handlePermission();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript">
            var application = {
                root: '<?php echo WEB_ROOT; ?>',
                contextRoot: '<?php echo ROOT; ?>',
                shopUrl: '<?php echo SHOP_CONFIG_URL; ?>',
                user: JSON.parse('<?php echo isset($_SESSION['user']) ? $_SESSION['user'] : 'null'; ?>'),
                thaiVat: <?php echo THAI_VAT; ?>,
                quotationAvailable: <?php echo QUOTATION_AVAILABLE ?>
            }
        </script>
        <title>SirichaiElectric configuration</title>
    </head>

    <body>
        <div id="react-root"></div>
        <!-- Dependencies -->
        <script src="<?php echo WEB_ROOT ?>dist/bundle.js?v=<?php echo uniqid()?>"></script>
    </body>
</html>