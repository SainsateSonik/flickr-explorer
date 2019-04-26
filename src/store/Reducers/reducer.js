import * as actionTypes from "../ActionTypes/actionTypes";

// Default state of the Application
const initialState = {
    searchContext: "",
    photosURL: [],
    loading: false,
    modalPhoto: null,
    isLastPage: false
};

const reducer = (state = initialState, action) => {

    // update search context
    const inputHandler = (value) => ({
        ...state,
        searchContext: value,
        photosURL: value ? [...state.photosURL] : [],
        loading: value ? true : false
    });

    // add photos or append to the stack
    const addPhotosUrl = (photos, isLastPage, isContextNew) => ({
        ...state,
        photosURL: isContextNew ? photos : [...state.photosURL, ...photos],
        loading: false,
        isLastPage
    });

    // add image to the Modal
    const enlargePhoto = photo => ({
        ...state,
        modalPhoto: photo
    });

    switch(action.type) {
        case actionTypes.HANDLE_INPUT_CHANGE: return inputHandler(action.value);
        case actionTypes.ADD_PHOTOS_URL: return addPhotosUrl(action.photos, action.isLastPage, action.isContextNew);
        case actionTypes.ENLARGE_PHOTO: return enlargePhoto(action.photo);
        default: return state;
    }
};

export default reducer;