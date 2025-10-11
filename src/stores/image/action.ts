import { Image } from 'stores/types/Image';
import { SetImagesAction, ImageStateTypes } from './type';

const actionCreators = {
    setImage: (image: Image): SetImagesAction => {
        return { payload: image, type: ImageStateTypes.SET_IMAGES };
    },
}

export const imageStateAction = { ...actionCreators }