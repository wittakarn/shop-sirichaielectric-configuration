import { ProductDisplayRequest, ProductRequest } from 'interfaces/Product';
import * as superagent from 'superagent';

export async function searchProducts(productName: string): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/search-products.php`);
    return await agent.type('application/json').query({ productName, size: 20 });
};

export async function getProductOptions(productName: string): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/list-product-options.php`);
    return await agent.type('application/json').query({ productName });
};

export async function getProducts(menuId: number | null, productName: string): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/products.php`);
    return await agent.type('application/json').query({ menuId, productName });
};

export async function getProduct(productId: number): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/product-info.php`);
    return await agent.type('application/json').query({ productId });
};

export async function updateProduct(request: ProductRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/update-product.php`);

    if (request.productImage) {
        agent.attach('productImage', request.productImage as any);
    }

    if (request.specificationImage) {
        agent.attach('specificationImage', request.specificationImage as any);
    }

    if (request.specificationPdf) {
        agent.attach('specificationPdf', request.specificationPdf as any);
    }

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};

export async function updateProductsDisplay(request: ProductDisplayRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/update-products-display.php`);

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};