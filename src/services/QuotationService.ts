import { QuotationFormValues } from 'interfaces/Quotation';
import * as superagent from 'superagent';

export async function createQuotation(request: QuotationFormValues): Promise<superagent.Response> {
  const agent = superagent.post(`${application.root}server/rest/create-quotation.php`);
  return await agent
    .accept('application/json; charset=UTF-8')
    .field('data', JSON.stringify(request));
}

export async function updateQuotation(request: QuotationFormValues): Promise<superagent.Response> {
  const agent = superagent.post(`${application.root}server/rest/update-quotation.php`);
  return await agent
    .accept('application/json; charset=UTF-8')
    .field('data', JSON.stringify(request));
}

export async function getQuotMastList(customerId: number, limit = 10): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/list-quotation.php`);
  return await agent.type('application/json').query({ customerId, limit });
};

export async function getPriceList(customerId: number, productId: number): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/list-quotation-price.php`);
  return await agent.type('application/json').query({ customerId, productId, limit: 3 });
};

export async function getQuotation(quotNo: string): Promise<superagent.Response> {
  const agent = superagent.get(`${application.root}server/rest/quotation.php`);
  return await agent.type('application/json').query({ quotNo });
};