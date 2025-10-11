import * as superagent from 'superagent';
import { Customer } from 'interfaces/Customer';

export async function createCustomer(request: Customer): Promise<superagent.Response> {
  const agent = superagent.post(`${application.root}server/rest/create-customer.php`);
  return await agent
    .accept('application/json; charset=UTF-8')
    .field('data', JSON.stringify(request));
}

export async function getCustomers(customerName: string): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/search-customer.php`);
  return await agent.type('application/json').query({ customerName });
};

export async function getCustomer(id: number): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/customer-info.php`);
  return await agent.type('application/json').query({ id });
};

export async function updateCustomer(request: Customer): Promise<superagent.Response> {
  const agent = superagent.post(`${application.root}server/rest/update-customer.php`);
  return await agent
    .accept('application/json; charset=UTF-8')
    .field('data', JSON.stringify(request));
};

export async function deleteCustomer(id: number): Promise<superagent.Response> {
  const agent = superagent.post(`${application.root}server/rest/delete-customer.php`);

  return await agent
    .accept('application/json; charset=UTF-8')
    .field('data', JSON.stringify({ id }));
};

export async function getCustomerOptions(customerName: string): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/list-customer-options.php`);
  return await agent.type('application/json').query({ customerName });
}