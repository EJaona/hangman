interface Array<T> {
    _pickRandomValue():string
}

Array.prototype._pickRandomValue = function(this:string[]):string { return this[ Math.floor( Math.random() * this.length ) ] }