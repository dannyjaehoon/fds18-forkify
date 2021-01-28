import axios from "axios";
import Recipe from './Recipe';

class Bookmark {
    constructor() {
        this._state = {
            bookmarkList: []
        }
    }

    addBookmark(recipe) {
        this._state.bookmarkList.push(recipe);
        localStorage.setItem('bookmarkList', JSON.stringify(this._state.bookmarkList));
    }

    getCurrentBookList() {
        return this._state.bookmarkList;
    }

    removeBookmark() {
        this._state.bookmarkList.pop();
        localStorage.setItem('bookmarkList', JSON.stringify(this._state.bookmarkList));
    }

    isRecipeStored(targetRecipe) {
        for (let i = 0; i < this._state.bookmarkList.length; i++) {
            if (this._state.bookmarkList[i].id === targetRecipe.id) return true;
        }
        return false;
    }
}

export default new Bookmark();