class IndexedMap {
  #map = {};
  #keys = [];

  get map() {
    return { ...this.#map };
  }

  get keys() {
    return [...this.#keys];
  }

  set(key, value) {
    if (!this.#map.hasOwnProperty(key)) {
      this.#keys.push(key);
    }
    this.#map[key] = value;
    return this;
  }

  has(key) {
    return this.#map.hasOwnProperty(key);
  }

  hasIndex(index) {
    return index >= 0 && this.#keys.length > index;
  }

  get(key) {
    return this.has(key) ? this.#map[key] : null;
  }

  getByIndex(index) {
    if (this.hasIndex(index)) {
      const key = this.#keys[index];
      return this.#map[key];
    }
    return null;
  }

  remove(key) {
    if (this.has(key)) {
      this.#keys = this.#keys.filter((k) => k !== key);
      delete this.#map[key];
    }
    return this;
  }

  size() {
    return this.#keys.length;
  }

  forEach(callback) {
    this.#keys.forEach((key, index) => {
      const value = this.#map[key];
      callback?.(value, key, index);
    });
    return this;
  }

  union(...maps) {
    let newMap = { ...this.#map };
    let newKeys = [...this.#keys];
    maps.forEach((indexedMap) => {
      newMap = { ...newMap, ...indexedMap?.map };
      newKeys = [...newKeys, ...indexedMap?.keys];
    });
    this.#map = newMap;
    this.#keys = [...new Set(newKeys)];
    return this;
  }

  uniq() {
    return [...new Set(Object.values(this.#map))];
  }

  sort(callback) {
    this.#keys.sort((key1, key2) => {
      const value1 = this.#map[key1];
      const value2 = this.#map[key2];
      return callback?.(value1, value2, key1, key2);
    });
    return this;
  }

  sortIndexes(callback) {
    this.#keys.sort((key1, key2) => {
      const index1 = this.#keys.indexOf(key1);
      const index2 = this.#keys.indexOf(key2);
      return callback?.(index1, index2);
    });
    return this;
  }

  setTo(index, key, value) {
    this.remove(key);
    this.#map[key] = value;
    this.#keys.splice(index, 0, key);
    return this;
  }

  removeAt(index, count = 1) {
    const removedKeys = this.#keys.splice(index, count);
    removedKeys.forEach((key) => {
      delete this.#map[key];
    });
    return this;
  }
}

export default IndexedMap;
