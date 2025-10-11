import { Action } from 'redux';
import { Image } from 'stores/types/Image';

export enum ImageStateTypes {
    SET_IMAGES = 'image/SET_IMAGES',
}

export interface ImageState {
    images: { [imageKey: string] : Image; };
}

export interface SetImagesAction extends Action {
    type: typeof ImageStateTypes.SET_IMAGES;
    payload: Image;
}

export type ImageStateAction = SetImagesAction;