# Batch Product Pricing Update API

## Overview
This API endpoint allows batch updating of product prices. It accepts an array of products with their IDs and pricing information, validates each product, and updates the database in a single transaction.

## Endpoint Information

**URL:** `POST /server/rest/update-products-pricing.php`

**Content-Type:** `multipart/form-data`

**Authentication:** Session-based (inherited from application)

## Request Format

### HTTP Request
```http
POST /server/rest/update-products-pricing.php
Content-Type: multipart/form-data

data={"products":[...]}
```

### Request Body Structure
The request must include a `data` field containing a JSON string with the following structure:

```json
{
  "products": [
    {
      "productId": 123,
      "standardPrice": 1500.00,
      "capitalPrice": 1200.00,
      "bPrice": 1400.00
    },
    {
      "productId": 456,
      "ssPrice": 2000.00,
      "sPrice": 1900.00
    }
  ]
}
```

### Product Object Fields

| Field (camelCase) | Database Column | Description | Required |
|-------------------|-----------------|-------------|----------|
| `productId` | `product_id` | Product ID | **Yes** |
| `standardPrice` | `standard_price` | ราคาตั้ง (Standard Price) | No |
| `capitalPrice` | `capital_price` | ทุน (Capital/Cost Price) | No |
| `ssPrice` | `ss_price` | V-S Price | No |
| `sPrice` | `s_price` | V-A Price | No |
| `aPrice` | `a_price` | NV-A Price | No |
| `bPrice` | `b_price` | NV-B Price | No |
| `cPrice` | `c_price` | NV-C Price | No |
| `vbPrice` | `vb_price` | V-B Price | No |
| `vcPrice` | `vc_price` | V-C Price | No |
| `dPrice` | `d_price` | NV-DIS Price | No |
| `ePrice` | `e_price` | V-DIS Price | No |
| `fPrice` | `f_price` | F Price | No |

**Notes:**
- Only `productId` is required
- Include only the price fields you want to update
- Price fields can be `null` to clear the value
- Commas in price values will be automatically removed
- All price values are stored as `DECIMAL(15,2)`

## Response Format

### Success Response
```json
{
  "status": "success",
  "updatedCount": 2,
  "totalCount": 3,
  "failedProducts": [
    {
      "productId": 999,
      "error": "Product not found"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "success" if request completed |
| `updatedCount` | integer | Number of products successfully updated |
| `totalCount` | integer | Total number of products in request |
| `failedProducts` | array | List of products that failed to update with error details |

### Error Response (HTTP 500)
```json
{
  "error": "Failed to update products pricing: [error message]"
}
```

## Examples

### Example 1: Update Multiple Price Fields
```json
{
  "products": [
    {
      "productId": 100,
      "standardPrice": 5000.00,
      "capitalPrice": 4000.00,
      "bPrice": 4500.00,
      "cPrice": 4300.00
    }
  ]
}
```

### Example 2: Update Single Price Field
```json
{
  "products": [
    {
      "productId": 200,
      "bPrice": 3500.00
    }
  ]
}
```

### Example 3: Batch Update with Mixed Fields
```json
{
  "products": [
    {
      "productId": 101,
      "standardPrice": 1500.00,
      "bPrice": 1400.00
    },
    {
      "productId": 102,
      "capitalPrice": 2000.00,
      "ssPrice": 2500.00,
      "sPrice": 2300.00
    },
    {
      "productId": 103,
      "aPrice": 1800.00,
      "vbPrice": 1600.00
    }
  ]
}
```

### Example 4: Clear Price Value (Set to NULL)
```json
{
  "products": [
    {
      "productId": 150,
      "fPrice": null
    }
  ]
}
```

## Java Implementation Example

### Using Apache HttpClient 4.5+

```java
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

import java.math.BigDecimal;
import java.util.List;

public class ProductPricingService {

    private static final String API_URL = "http://your-domain/server/rest/update-products-pricing.php";
    private final Gson gson = new Gson();

    public PricingUpdateResponse updateProductsPricing(List<ProductPricing> products) throws Exception {
        // Build JSON payload
        JsonObject payload = new JsonObject();
        JsonArray productsArray = new JsonArray();

        for (ProductPricing product : products) {
            JsonObject productObj = new JsonObject();
            productObj.addProperty("productId", product.getProductId());

            // Add only non-null price fields
            if (product.getStandardPrice() != null) {
                productObj.addProperty("standardPrice", product.getStandardPrice());
            }
            if (product.getCapitalPrice() != null) {
                productObj.addProperty("capitalPrice", product.getCapitalPrice());
            }
            if (product.getSsPrice() != null) {
                productObj.addProperty("ssPrice", product.getSsPrice());
            }
            if (product.getSPrice() != null) {
                productObj.addProperty("sPrice", product.getSPrice());
            }
            if (product.getAPrice() != null) {
                productObj.addProperty("aPrice", product.getAPrice());
            }
            if (product.getBPrice() != null) {
                productObj.addProperty("bPrice", product.getBPrice());
            }
            if (product.getCPrice() != null) {
                productObj.addProperty("cPrice", product.getCPrice());
            }
            if (product.getVbPrice() != null) {
                productObj.addProperty("vbPrice", product.getVbPrice());
            }
            if (product.getVcPrice() != null) {
                productObj.addProperty("vcPrice", product.getVcPrice());
            }
            if (product.getDPrice() != null) {
                productObj.addProperty("dPrice", product.getDPrice());
            }
            if (product.getEPrice() != null) {
                productObj.addProperty("ePrice", product.getEPrice());
            }
            if (product.getFPrice() != null) {
                productObj.addProperty("fPrice", product.getFPrice());
            }

            productsArray.add(productObj);
        }

        payload.add("products", productsArray);
        String jsonData = gson.toJson(payload);

        // Create HTTP request
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(API_URL);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addTextBody("data", jsonData);

            httpPost.setEntity(builder.build());

            // Execute request
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseBody = EntityUtils.toString(response.getEntity());

                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new Exception("API Error: " + responseBody);
                }

                return gson.fromJson(responseBody, PricingUpdateResponse.class);
            }
        }
    }
}

// Data classes
class ProductPricing {
    private Integer productId;
    private BigDecimal standardPrice;
    private BigDecimal capitalPrice;
    private BigDecimal ssPrice;
    private BigDecimal sPrice;
    private BigDecimal aPrice;
    private BigDecimal bPrice;
    private BigDecimal cPrice;
    private BigDecimal vbPrice;
    private BigDecimal vcPrice;
    private BigDecimal dPrice;
    private BigDecimal ePrice;
    private BigDecimal fPrice;

    // Getters and setters...
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public BigDecimal getStandardPrice() { return standardPrice; }
    public void setStandardPrice(BigDecimal standardPrice) { this.standardPrice = standardPrice; }

    public BigDecimal getCapitalPrice() { return capitalPrice; }
    public void setCapitalPrice(BigDecimal capitalPrice) { this.capitalPrice = capitalPrice; }

    // ... other getters and setters
}

class PricingUpdateResponse {
    private String status;
    private Integer updatedCount;
    private Integer totalCount;
    private List<FailedProduct> failedProducts;

    // Getters and setters...
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getUpdatedCount() { return updatedCount; }
    public void setUpdatedCount(Integer updatedCount) { this.updatedCount = updatedCount; }

    public Integer getTotalCount() { return totalCount; }
    public void setTotalCount(Integer totalCount) { this.totalCount = totalCount; }

    public List<FailedProduct> getFailedProducts() { return failedProducts; }
    public void setFailedProducts(List<FailedProduct> failedProducts) { this.failedProducts = failedProducts; }
}

class FailedProduct {
    private Integer productId;
    private String error;

    // Getters and setters...
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
```

### Usage Example
```java
public class Main {
    public static void main(String[] args) {
        try {
            ProductPricingService service = new ProductPricingService();

            // Create product pricing updates
            List<ProductPricing> products = new ArrayList<>();

            ProductPricing product1 = new ProductPricing();
            product1.setProductId(123);
            product1.setStandardPrice(new BigDecimal("1500.00"));
            product1.setBPrice(new BigDecimal("1400.00"));
            products.add(product1);

            ProductPricing product2 = new ProductPricing();
            product2.setProductId(456);
            product2.setCapitalPrice(new BigDecimal("2000.00"));
            products.add(product2);

            // Update pricing
            PricingUpdateResponse response = service.updateProductsPricing(products);

            System.out.println("Status: " + response.getStatus());
            System.out.println("Updated: " + response.getUpdatedCount() + "/" + response.getTotalCount());

            if (!response.getFailedProducts().isEmpty()) {
                System.out.println("Failed products:");
                for (FailedProduct failed : response.getFailedProducts()) {
                    System.out.println("  - Product " + failed.getProductId() + ": " + failed.getError());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Validation Rules

1. **Product ID Required**: Every product must have a `productId`
2. **Product Must Exist**: The product ID must exist in the database
3. **At Least One Price Field**: At least one price field should be provided (otherwise no update occurs)
4. **Numeric Values**: All price fields must be valid numeric values or null
5. **Decimal Precision**: Prices are stored with 2 decimal places (DECIMAL 15,2)

## Error Handling

### Validation Errors
Individual product validation errors are returned in the `failedProducts` array:
- **"Missing productId"**: Product object doesn't have productId field
- **"Product not found"**: Product ID doesn't exist in database

### Transaction Handling
- All updates are performed within a database transaction
- If a critical error occurs, all changes are rolled back
- Individual product failures don't affect other products in the batch
- Transaction commits after processing all products

### HTTP Error Codes
- **200 OK**: Request processed successfully (check `failedProducts` for individual failures)
- **500 Internal Server Error**: Critical server error with error message in response body

## Performance Considerations

1. **Batch Size**: Recommended maximum 100-500 products per request
2. **Transaction Time**: Large batches may cause long-running transactions
3. **Memory Usage**: Each product consumes memory during processing
4. **Network Timeout**: Consider client timeout settings for large batches

## Implementation Files

- **REST Endpoint**: `/server/rest/update-products-pricing.php`
- **Business Logic**: `/server/business/ProductBusiness.php` (method: `updateProductsPricing`)
- **Repository**: `/server/repository/ProductRepository.php` (method: `updateProductPricing`)

## Database Schema Reference

```sql
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `standard_price` decimal(15,2) DEFAULT NULL COMMENT 'ราคาตั้ง',
  `capital_price` decimal(15,2) DEFAULT NULL COMMENT 'ทุน',
  `ss_price` decimal(15,2) DEFAULT NULL COMMENT 'V-S',
  `s_price` decimal(15,2) DEFAULT NULL COMMENT 'V-A',
  `a_price` decimal(15,2) DEFAULT NULL COMMENT 'NV-A',
  `b_price` decimal(15,2) DEFAULT NULL COMMENT 'NV-B',
  `c_price` decimal(15,2) DEFAULT NULL COMMENT 'NV-C',
  `vb_price` decimal(15,2) DEFAULT NULL COMMENT 'V-B',
  `vc_price` decimal(15,2) DEFAULT NULL COMMENT 'V-C',
  `d_price` decimal(15,2) DEFAULT NULL COMMENT 'NV-DIS',
  `e_price` decimal(15,2) DEFAULT NULL COMMENT 'V-DIS',
  `f_price` decimal(15,2) DEFAULT NULL,
  -- other fields...
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
```

## Testing

### Test with cURL
```bash
curl -X POST "http://your-domain/server/rest/update-products-pricing.php" \
  -F 'data={"products":[{"productId":123,"standardPrice":1500.00,"bPrice":1400.00}]}'
```

### Test Response Validation
1. Verify `status` is "success"
2. Check `updatedCount` matches expected successful updates
3. Review `failedProducts` array for any errors
4. Confirm database values are updated correctly

## Support

For issues or questions, please contact the development team or refer to the main project documentation.

---

**Version**: 1.0
**Last Updated**: 2026-02-05
**Author**: Development Team
