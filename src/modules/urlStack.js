class URLStack {
  constructor() {
    this.urls = []; 
  }

  push(url) {
    this.urls.push(url);
  }

  pop() {
    if (this.isEmpty()) {
      return null; 
    }
    return this.urls.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null; 
    }
    return this.urls[this.size() - 1];
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.urls.length;
  }

  print() {
    console.log(this.urls);
  }
}

const urlStack = new URLStack();

export default urlStack;

