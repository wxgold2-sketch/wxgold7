class Cache {
  constructor() {
    this.store = new Map();
  }
  
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }
  
  set(key, data, ttl = 10000) {
    this.store.set(key, { data, expiry: Date.now() + ttl });
  }
  
  size() { return this.store.size; }
}

module.exports = new Cache();
