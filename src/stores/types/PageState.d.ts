import { UserState } from 'stores/user/type';
import { ImageState } from 'stores/image/type';

export interface PageState {
    user: UserState;
    image: ImageState;
}