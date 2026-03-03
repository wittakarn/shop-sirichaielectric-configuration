import { ProductGroupRequest } from 'interfaces/ProductGroup';
import * as superagent from 'superagent';

export async function getProductGroups(productId: number | null, groupNameDisplay: string): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/search-product-groups.php`);
    return await agent.type('application/json').query({ productId, groupNameDisplay });
};

export async function getProductGroup(groupId: number): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/product-group-info.php`);
    return await agent.type('application/json').query({ groupId });
};

export async function createProductGroup(request: ProductGroupRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/create-product-group.php`);

    if (request.productGroupImage) {
        agent.attach('productGroupImage', request.productGroupImage as any);
    }

    if (request.productDefaultImage) {
        agent.attach('productDefaultImage', request.productDefaultImage as any);
    }

    if (request.groupSpecImages && request.groupSpecImages.length > 0) {
        request.groupSpecImages.forEach(file => {
            agent.attach('groupSpecImages[]', file as any);
        });
    }

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};

export async function updateProductGroup(request: ProductGroupRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/update-product-group.php`);

    if (request.productGroupImage) {
        agent.attach('productGroupImage', request.productGroupImage as any);
    }

    if (request.productDefaultImage) {
        agent.attach('productDefaultImage', request.productDefaultImage as any);
    }

    if (request.groupSpecImages && request.groupSpecImages.length > 0) {
        request.groupSpecImages.forEach(file => {
            agent.attach('groupSpecImages[]', file as any);
        });
    }

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};

export async function deleteProductGroup(groupId: number): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/delete-product-group.php`);

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify({ groupId }));
};
