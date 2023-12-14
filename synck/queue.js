class Queue {
  constructor() {
    this.list = [];
    this.front = 0;
    this.back = 0;
  }

  push(item) {
    this.list.push(item);
    this.back++;
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.list[this.front];
    this.front++;
    return item;
  }

  isEmpty() {
    return this.front === this.back;
  }

  size(){
    return this.list.length
  }

  display() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
    } else {
      for (let i = this.front; i < this.back; i++) {
        console.log(this.list[i] + " ");
      }
      console.log();
    }
  }
}

// Export the Queue class as the default export
export default Queue;

