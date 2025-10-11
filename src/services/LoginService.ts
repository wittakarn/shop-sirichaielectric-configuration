import * as superagent from 'superagent';
import { SigninRequest } from 'interfaces/LoginForm';

export async function signin(request: SigninRequest): Promise<superagent.Response> {
    const agent = superagent.post(`${application.root}server/rest/signin.php`);

    return await agent
        .accept('application/json; charset=UTF-8')
        .field('data', JSON.stringify(request));
};