class URLStack {
    constructor() {
        this.urls = []; 
        this.pos = -1;
    }

    push(url) {
        this.pos++;
        this.urls.splice(this.pos); // after pushing once, don't allow to goForward anymore
        this.urls.push(url);
    }

    goBack() {
        if (!this.canGoBack) return null;

        this.pos--;
        return this.urls[this.pos];
    }

    canGoBack() {
        return this.pos > 0;
    }

    goForward() {
        if (!this.canGoForward) return null;

        this.pos++;
        return this.urls[this.pos];
    }

    canGoForward() {
        return this.pos < this.size() - 1;
    }

    size() {
        return this.urls.length;
    }

    print() {
        console.log(`url stack - pos: ${this.pos} [${this.urls}]`);
    }
}

const urlStack = new URLStack();

export default urlStack;

