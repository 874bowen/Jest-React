function add(x: number, y: number) {
	return x + y;
}
export { add };

// class Calculator taking an options object in the constructor

class Calculator {
   private precision: number;
   constructor(options: { precision: number }) {
      this.precision = options.precision;
   }
   add(x: number, y: number) {
      return parseFloat((x + y).toFixed(this.precision));
   }
}

export { Calculator };