import { ImageState, ImageStateAction, ImageStateTypes } from './type';

const initialState: ImageState = {
    images: {},
};

const reducer = (state: ImageState = initialState, action: ImageStateAction): ImageState => {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case ImageStateTypes.SET_IMAGES:
            const image = action.payload;
            return {
                ...state,
                images: {
                    ...state.images,
                    [`${action.payload!.imageId}-${action.payload!.sequence}`]: {
                        detailNumber: Number(image.detailNumber),
                        extension: image.extension,
                        imageBase64Url: image.imageBase64Url,
                        imageId: Number(image.imageId),
                        imageName: image.imageName,
                        sequence: Number(image.sequence),
                    },
                },
            };
        default:
            return state;
    }
};

export { reducer as imageStateReducer }