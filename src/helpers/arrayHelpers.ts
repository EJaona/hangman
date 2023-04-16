interface Array<T> {
    _pickRandomWord():string
}

Array.prototype._pickRandomWord = function(this:string[]):string { return this[ Math.floor( Math.random() * this.length ) ] }