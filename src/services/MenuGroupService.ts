import * as superagent from 'superagent';
import { CreateMenuGroupRequest, MenuGroup, MenuGroupSearchForm } from 'interfaces/MenuGroup';

export async function getMenuInformation(menuGroupSearchForm: MenuGroupSearchForm): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/list-menu-information.php`);
    return await agent.type('application/json').query({ ...menuGroupSearchForm });
};

export async function getMenuGroups(groupNameDisplay: string): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/list-menu-group.php`);
    return await agent.type('application/json').query({ groupNameDisplay });
};

export async function getSubMenuGroups(groupParentId: number): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/list-sub-menu-group.php`);
    return await agent.type('application/json').query({ groupParentId });
};

export async function getInventoryItems(id: number): Promise<superagent.Response> {
    const agent = superagent.get(`${application.root}server/rest/list-inventory.php`);
    return await agent.type('application/json').query({ id });
};

export async function createMenuGroup(request: CreateMenuGroupRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/create-menu-group.php`);

    if (request.menuImage) {
        agent.attach('menuImage', request.menuImage as any);
    }

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};

export async function updateMenuGroup(request: CreateMenuGroupRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/update-menu-group.php`);

    if (request.menuImage) {
        agent.attach('menuImage', request.menuImage as any);
    }

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};

export async function deleteMenuGroup(id: number): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/delete-menu-group.php`);

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify({ id }));
};

export async function updateMenuGroupsSequence(request: MenuGroup[]): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/update-menu-groups-sequence.php`);
    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};